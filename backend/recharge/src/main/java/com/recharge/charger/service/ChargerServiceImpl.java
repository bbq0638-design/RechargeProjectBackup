package com.recharge.charger.service;

import com.recharge.charger.dao.ChargerDAO;
import com.recharge.charger.vo.ChargerVO;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class ChargerServiceImpl implements ChargerService {

    private final ChargerDAO chargerDAO;

    @Value("${ev.api.base-url}")
    private String baseUrl;

    @Value("${ev.api.num-of-rows}")
    private int numOfRows;

    @Value("${ev.api.data-type}")
    private String dataType;

    @Value("${ev.api.key}")
    private String serviceKey;

    /** 🔥 문자열 Sanitizing 공통 함수 */
    private String cleanString(String value) {
        if (value == null) return "";
        value = value.trim();
        if (value.equalsIgnoreCase("null") ||
                value.equals("()") ||
                value.equals("( )") ||
                value.isBlank()) {
            return "";
        }
        return value;
    }

    /** 📌 충전기 DB 저장 (INSERT/UPDATE) */
    @Override
    public void saveOrUpdate(ChargerVO chargerVO) {
        if (chargerDAO.existsCharger(chargerVO.getStationId(), chargerVO.getChargerId()) > 0) {
            chargerDAO.updateCharger(chargerVO);
        } else {
            chargerDAO.insertCharger(chargerVO);
        }
    }

    /** 🚀 충전기 전체 데이터 갱신 */
    @Override
    public int updateChargerData() {

        int totalCount = 0;
        int currentPage = 1;
        RestTemplate restTemplate = new RestTemplate();

        System.out.println("⚡ 충전기 데이터 업데이트 시작");

        // ⭐ 먼저 totalCount 1회 가져오기
        String initUrl = String.format(
                "%s/getChargerInfo?serviceKey=%s&pageNo=1&numOfRows=1&dataType=%s&zcode=44",
                baseUrl, serviceKey, dataType
        );

        String initResponse = restTemplate.getForObject(initUrl, String.class);
        JSONObject initJson = new JSONObject(initResponse);
        int total = initJson.optInt("totalCount", 0);

        int totalPage = (int) Math.ceil((double)total / numOfRows);

        System.out.println("📌 총 충전기 수: " + total + " / 페이지: " + totalPage);

        while (currentPage <= totalPage) {

            String apiUrl = String.format(
                    "%s/getChargerInfo?serviceKey=%s&pageNo=%d&numOfRows=%d&dataType=%s&zcode=44",
                    baseUrl, serviceKey, currentPage, numOfRows, dataType
            );

            System.out.println("📌 호출 URL: " + apiUrl);

            String response = restTemplate.getForObject(apiUrl, String.class);
            JSONObject json = new JSONObject(response);

            JSONArray items = json.getJSONObject("items").optJSONArray("item");

            if (items == null || items.isEmpty()) {
                System.out.println("❌ 데이터 없음 → 다음 페이지");
                currentPage++;
                continue;
            }

            System.out.println("📌 읽은 아이템 수: " + items.length());

            for (int i = 0; i < items.length(); i++) {
                JSONObject item = items.getJSONObject(i);

                String stationId = cleanString(item.optString("statId"));
                String chgId = cleanString(item.optString("chgerId"));

                if (stationId.isBlank() || chgId.isBlank()) continue;

                ChargerVO charger = new ChargerVO();
                charger.setStationId(stationId);
                charger.setChargerId(chgId);
                charger.setChargerProvider(cleanString(item.optString("busiNm")));
                charger.setChargerType(cleanString(item.optString("chgerType")));
                charger.setChargerSpeed(cleanString(item.optString("output")));

                int stat = item.optInt("stat", 0);

                charger.setChargerStatus(stat);
                charger.setChargerAvailable(stat == 2 ? 1 : 0);
                charger.setChargerTotal(1);

                saveOrUpdate(charger);
                totalCount++;
            }

            System.out.println("📌 누적 저장 건수: " + totalCount);

            currentPage++;
        }

        System.out.println("🎯 저장 완료 총 건수: " + totalCount);
        return totalCount;
    }

    /** 🔔 10분마다 자동 업데이트 */
    @Scheduled(fixedDelay = 600000)
    public void scheduleChargerUpdate() {
        updateChargerData();
    }
}
