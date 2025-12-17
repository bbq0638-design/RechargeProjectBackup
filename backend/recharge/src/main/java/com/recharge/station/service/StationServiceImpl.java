package com.recharge.station.service;

import com.recharge.station.dao.StationDAO;
import com.recharge.station.vo.StationVO;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StationServiceImpl implements StationService {

    private final StationDAO stationDAO;

    @Value("${ev.api.base-url}")
    private String baseUrl;

    @Value("${ev.api.num-of-rows}")
    private int numOfRows;

    @Value("${ev.api.data-type}")
    private String dataType;

    @Value("${ev.api.key}")
    private String serviceKey;

    @Value("${kakao.rest.api.key}")
    private String kakaoApiKey;

    /** ================================
     *  충전소 데이터 업데이트
     * ================================ */
    @Override
    public int updateStationData() {

        int totalCount = 0;
        int currentPage = 1;

        RestTemplate restTemplate = new RestTemplate();

        while (true) {
            String apiUrl = String.format(
                    "%s/getChargerInfo?serviceKey=%s&pageNo=%d&numOfRows=%d&dataType=%s&zcode=44",
                    baseUrl, serviceKey, currentPage, numOfRows, dataType
            );

            System.out.println("📌 Request URL: " + apiUrl);

            String response = restTemplate.getForObject(apiUrl, String.class);
            JSONObject json = new JSONObject(response);

            JSONArray items = json.getJSONObject("items").getJSONArray("item");

            if (items.isEmpty()) break;

            for (int i = 0; i < items.length(); i++) {

                JSONObject item = items.getJSONObject(i);

                StationVO station = new StationVO();
                station.setStationId(item.optString("statId", ""));
                station.setStationName(item.optString("statNm", ""));
                station.setStationLatitude(item.optDouble("lat", 0));
                station.setStationLongitude(item.optDouble("lng", 0));
                station.setStationAddress(item.optString("addr", ""));

                String addrDetail = item.optString("addrDetail", "");
                if ("null".equals(addrDetail)) addrDetail = "";
                station.setStationAddressDetail(addrDetail);

                station.setStationParkingFree(item.optString("parkingFree", "N"));

                totalCount += stationDAO.mergeStation(station);
            }

            System.out.println("📌 현재까지 저장된 건수: " + totalCount);
            currentPage++;
        }

        System.out.println("🎯 충남 전체 충전소 저장 완료 총 건수: " + totalCount);
        return totalCount;
    }


    /** ================================
     *  반경 조회
     * ================================ */
    @Override
    public List<StationVO> getStationByDistance(double lat, double lng, double radiusKm) {
        Map<String, Object> params = new HashMap<>();
        params.put("lat", lat);
        params.put("lng", lng);
        params.put("radiusKm", radiusKm);
        return stationDAO.getStationsByDistance(params);
    }

    @Override
    public List<StationVO> getStationsWithCharger() {
        return stationDAO.findStationWithCharger();
    }

    /** ================================
     *  주소/키워드 검색 + 좌표 변환 + 반경 조회
     * ================================ */
    @Override
    public Map<String, Object> searchStationsByAddress(String query, double radiusKm) {

        RestTemplate restTemplate = new RestTemplate();

        // 🔥 Kakao Header
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // 🔥 1차: 키워드 검색
        String keywordUrl = UriComponentsBuilder
                .fromHttpUrl("https://dapi.kakao.com/v2/local/search/keyword.json")
                .queryParam("query", query)
                .build(false)
                .toUriString();

        System.out.println("========== KAKAO REQUEST ==========");
        System.out.println("URL   : " + keywordUrl);
        System.out.println("KEY   : " + kakaoApiKey);
        System.out.println("Query : " + query);
        System.out.println("===================================");

        ResponseEntity<String> rawRes =
                restTemplate.exchange(keywordUrl, HttpMethod.GET, entity, String.class);

        System.out.println("========== RAW RESPONSE ==========");
        System.out.println(rawRes.getBody());
        System.out.println("===================================");

        JSONObject json = new JSONObject(rawRes.getBody());
        JSONArray docs = json.getJSONArray("documents");

        // 🔥 키워드 검색 실패 → 주소 검색 fallback
        if (docs.isEmpty()) {
            String addrUrl = UriComponentsBuilder
                    .fromHttpUrl("https://dapi.kakao.com/v2/local/search/address.json")
                    .queryParam("query", query)
                    .build(false)
                    .toUriString();

            System.out.println("====== TRY ADDRESS SEARCH ======");
            System.out.println("URL : " + addrUrl);

            rawRes = restTemplate.exchange(addrUrl, HttpMethod.GET, entity, String.class);
            System.out.println("===== ADDRESS RAW =====");
            System.out.println(rawRes.getBody());

            JSONObject addrJson = new JSONObject(rawRes.getBody());
            docs = addrJson.getJSONArray("documents");

            if (docs.isEmpty()) {
                return Map.of("status", "empty");
            }
        }

        // 🔥 정확도 높은 첫 번째 결과
        JSONObject first = docs.getJSONObject(0);

        double lat = first.getDouble("y");
        double lng = first.getDouble("x");

        String keyword = first.has("place_name")
                ? first.optString("place_name")
                : first.optString("address_name");

        // 🔥 반경 충전소 조회
        List<StationVO> stations = getStationByDistance(lat, lng, radiusKm);

        Map<String, Object> result = new HashMap<>();
        result.put("status", "ok");
        result.put("query", query);
        result.put("keyword", keyword);
        result.put("lat", lat);
        result.put("lng", lng);
        result.put("stations", stations);

        return result;
    }

    @Override
    public List<Map<String, Object>> getAutocomplete(String query) {

        String KAKAO_KEY = kakaoApiKey.trim();
        RestTemplate rest = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + KAKAO_KEY);

        List<Map<String, Object>> result = new java.util.ArrayList<>();

        try {
            // ===== 1) 주소 검색 (address.json) =====
            String addrUrl = UriComponentsBuilder
                    .fromHttpUrl("https://dapi.kakao.com/v2/local/search/address.json")
                    .queryParam("query", query)
                    .build()
                    .toUriString();

            ResponseEntity<Map> addrRes =
                    rest.exchange(addrUrl, HttpMethod.GET, new HttpEntity<>(headers), Map.class);

            Map body1 = addrRes.getBody();
            if (body1 != null && body1.get("documents") != null) {
                result.addAll((List<Map<String, Object>>) body1.get("documents"));
            }

            // ===== 2) 키워드 검색 (keyword.json) =====
            String keyUrl = UriComponentsBuilder
                    .fromHttpUrl("https://dapi.kakao.com/v2/local/search/keyword.json")
                    .queryParam("query", query)
                    .build()
                    .toUriString();

            ResponseEntity<Map> keyRes =
                    rest.exchange(keyUrl, HttpMethod.GET, new HttpEntity<>(headers), Map.class);

            Map body2 = keyRes.getBody();
            if (body2 != null && body2.get("documents") != null) {
                result.addAll((List<Map<String, Object>>) body2.get("documents"));
            }

            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }


}

