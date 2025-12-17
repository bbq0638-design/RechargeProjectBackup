package com.recharge.place.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recharge.place.dao.PlaceDAO;
import com.recharge.place.vo.PlaceVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlaceServiceImpl implements PlaceService {

    private final PlaceDAO placeDAO;

    @Value("${kakao.rest.api.key}")
    private String kakaoApiKey;

    // 카카오 category_group_code → 내부 category_id 매핑
    private static final Map<String, String> categoryMapper = new HashMap<>();
    static {
        categoryMapper.put("MT1", "KAKAO01");
        categoryMapper.put("CS2", "KAKAO02");
        categoryMapper.put("PO3", "KAKAO03");
        categoryMapper.put("AT4", "KAKAO04");
        categoryMapper.put("AD5", "KAKAO05");
        categoryMapper.put("FD6", "KAKAO06");
        categoryMapper.put("CE7", "KAKAO07");
        categoryMapper.put("HP8", "KAKAO08");
        categoryMapper.put("CT1", "KAKAO09");
        categoryMapper.put("BK9", "KAKAO10");
    }

    private static final List<String> kakaoCodes = Arrays.asList(
            "MT1", "CS2", "PO3", "AT4", "AD5", "FD6", "CE7", "HP8", "CT1", "BK9"
    );

    private static final int DB_MIN_COUNT = 150;

    @Override
    public List<PlaceVO> getNearbyPlaces(Double lat, Double lng, Double radius) {

        List<PlaceVO> dbPlaces = placeDAO.findPlaceByLocation(lat, lng, radius);

        if (dbPlaces.size() >= DB_MIN_COUNT) {
            log.info("🟢 DB 데이터 충분 {}개 → API 호출 생략", dbPlaces.size());
            return dbPlaces;
        }

        log.info("🟠 DB 데이터 부족 {}개 → API 보충", dbPlaces.size());

        kakaoCodes.forEach(code -> fetchAndSavePlaces(code, lat, lng, radius));

        dbPlaces = placeDAO.findPlaceByLocation(lat, lng, radius);
        log.info("📍 저장 완료 후 총 {}개 반환", dbPlaces.size());

        return dbPlaces;
    }

    private void fetchAndSavePlaces(String code, Double lat, Double lng, Double radius) {

        int page = 1;
        boolean isEnd = false;

        while (!isEnd && page <= 45) {

            String url = "https://dapi.kakao.com/v2/local/search/category.json"
                    + "?category_group_code=" + code
                    + "&x=" + lng
                    + "&y=" + lat
                    + "&radius=" + (int)(radius * 1000)
                    + "&page=" + page
                    + "&size=15";

            try {
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "KakaoAK " + kakaoApiKey.trim());
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<String> response =
                        restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

                JsonNode root = new ObjectMapper().readTree(response.getBody());
                JsonNode documents = root.path("documents");

                documents.forEach(doc -> savePlaceIfNotExists(doc, code));

                isEnd = root.path("meta").path("is_end").asBoolean();
                page++;

                Thread.sleep(350);

            } catch (Exception e) {
                log.error("🔥 카카오 API 오류 발생:", e);
                break;
            }
        }

        log.info("📍 {} 저장/갱신 완료 (page:{})", code, page - 1);
    }

    private void savePlaceIfNotExists(JsonNode doc, String kakaoCode) {

        String kakaoPlaceId = doc.path("id").asText(); // 👈 핵심 추가! 카카오 고유 ID
        String categoryId = categoryMapper.get(kakaoCode);
        if (categoryId == null) return;

        // ❌ 도로명주소 없으면 지번주소 적용
        String finalAddress = doc.path("road_address_name").asText();
        if (finalAddress == null || finalAddress.isEmpty()) {
            finalAddress = doc.path("address_name").asText();
        }

        PlaceVO place = new PlaceVO();
        place.setKakaoPlaceId(kakaoPlaceId); // 👈 중복 방지 핵심
        place.setPlaceName(doc.path("place_name").asText());
        place.setCategoryId(categoryId);
        place.setPlaceAddress(finalAddress);
        place.setPlaceAddressDetail("");
        place.setPlacePhone(doc.path("phone").asText());
        place.setPlaceLongitude(doc.path("x").asDouble());
        place.setPlaceLatitude(doc.path("y").asDouble());
        place.setCreateId("SYSTEM");

        if (placeDAO.existsByKakaoPlaceId(kakaoPlaceId) == 0) {
            placeDAO.insertPlace(place);
            log.info("🟢 신규 저장: {}", place.getPlaceName());
        } else {
            log.debug("⏭️ 중복 스킵: {}", place.getPlaceName());
        }
    }
}
