package com.recharge.music.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.recharge.music.dao.ConcertDAO;
import com.recharge.music.vo.ConcertVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ConcertService {

    private final ConcertDAO concertDAO;
    private final WebClient kopisWebClient;

    @Value("${kopis.api.key}")
    private String apiKey;


    /** 🔥 오늘 이후 대중공연 불러오기 + XML → JSON 변환 */
    public List<ConcertVO> fetchUpcomingConcerts(int limit) {

        String today = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);

        String xml = kopisWebClient.get()
                .uri(uri -> uri.path("/openApi/restful/pblprfr")
                        .queryParam("service", apiKey)
                        .queryParam("stdate", today)
                        .queryParam("eddate", "20301231")
                        .queryParam("cpage", 1)
                        .queryParam("rows", 50)
                        .queryParam("shcate", "CCCD")   // 대중음악 장르 코드
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (xml == null) return List.of();

        List<ConcertVO> result = new ArrayList<>();

        try {
            XmlMapper xmlMapper = new XmlMapper();
            JsonNode root = xmlMapper.readTree(xml);

            JsonNode listNode = root.path("dbs").path("db");
            if (listNode.isMissingNode()) {
                listNode = root.path("db");
            }

            if (!listNode.isArray()) return result;

            for (JsonNode node : listNode) {

                String poster = node.path("poster").asText("");
                if (poster.isBlank()) continue; // 포스터 없는 공연 제외

                if (poster.endsWith(".gif")) {
                    poster = poster.replace(".gif", ".jpg");
                }

// 그래도 gif거나 빈 값이면 제외
                if (poster.endsWith(".gif") || poster.isBlank()) continue;


                String title = node.path("prfnm").asText("");
                String start = node.path("prfpdfrom").asText("");
                String end = node.path("prfpdto").asText("");
                String genre = node.path("genrenm").asText("");

                ConcertVO vo = new ConcertVO();
                vo.setTitle(title);
                vo.setPoster(poster);
                vo.setStartDate(start);
                vo.setEndDate(end);

                System.out.println("🎤 공연명=" + title + ", 장르=" + genre);

                result.add(vo);

                if (result.size() >= limit) break;
            }

        } catch (IOException e) {
            throw new RuntimeException("XML 파싱 실패", e);
        }

        return result;
    }

    /** 🔥 매일 3시에 자동으로 공연 정보 갱신 */
    @Transactional
    public void refreshConcerts() {
        List<ConcertVO> concerts = fetchUpcomingConcerts(5);

        concertDAO.deleteAllConcerts();

        for (ConcertVO vo : concerts) {
            concertDAO.insertConcert(vo);
        }
    }

    /** 🔥 프론트가 사용하는 목록 */
    public List<ConcertVO> getConcerts() {
        return concertDAO.selectTopConcerts();
    }
}
