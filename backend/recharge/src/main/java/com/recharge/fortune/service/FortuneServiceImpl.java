package com.recharge.fortune.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recharge.fortune.vo.FortuneVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Service
public class FortuneServiceImpl implements FortuneService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String generateFortune(FortuneVO vo) throws Exception {

        String prompt = switch (vo.getType()) {
            case "saju" -> buildSajuPrompt(vo);
            case "today" -> buildTodayPrompt(vo);
            case "star" -> buildStarPrompt(vo);
            case "zodiac" -> buildZodiacPrompt(vo);
            default -> throw new IllegalArgumentException("잘못된 운세 타입입니다.");
        };

        // 🔥 여기서 실제 운세 텍스트만 리턴
        return callGemini(prompt);
    }

    private String callGemini(String prompt) throws IOException {

        String apiUrl =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setRequestProperty("x-goog-api-key", apiKey); // ✅ 헤더로 키 전달
        conn.setDoOutput(true);

        // JSON 바디 안전하게 생성 (escape 문제 방지)
        String jsonBody = objectMapper.writeValueAsString(
                objectMapper.readTree("""
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": ""
                        }
                      ]
                    }
                  ]
                }
                """)
        );
        // 위 템플릿에 prompt만 삽입
        JsonNode root = objectMapper.readTree(jsonBody);
        ((com.fasterxml.jackson.databind.node.ObjectNode)
                root.get("contents").get(0).get("parts").get(0))
                .put("text", prompt);

        String finalBody = objectMapper.writeValueAsString(root);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(finalBody.getBytes(StandardCharsets.UTF_8));
        }

        int status = conn.getResponseCode();
        InputStream is = (status >= 200 && status < 300)
                ? conn.getInputStream()
                : conn.getErrorStream();

        StringBuilder res = new StringBuilder();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) res.append(line);
        }

        String responseBody = res.toString();
        System.out.println("🔍 Gemini raw response: " + responseBody);

        if (status < 200 || status >= 300) {
            // 에러 메시지 그대로 던져서 프론트에서 catch로 처리
            throw new RuntimeException("Gemini API 오류(" + status + "): " + responseBody);
        }

        // ✅ 여기서 candidates[0].content.parts[0].text 추출
        JsonNode json = objectMapper.readTree(responseBody);

        JsonNode candidates = json.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            return "운세 결과 없음 (응답에 candidates가 없습니다.)";
        }

        JsonNode first = candidates.get(0);
        JsonNode parts = first.path("content").path("parts");
        if (!parts.isArray() || parts.isEmpty()) {
            return "운세 결과 없음 (응답에 text가 없습니다.)";
        }

        String text = parts.get(0).path("text").asText("");
        if (text == null || text.isBlank()) {
            return "운세 결과 없음 (빈 텍스트)";
        }

        return text;
    }

    private String buildSajuPrompt(FortuneVO v) {
        return """
        아래 사용자의 정보를 기반으로 오늘의 사주 운세를 생성해줘.

        [사용자 정보]
        - 성별: %s
        - 생년월일: %s (%s)
        - 태어난 시: %s

        [생성 규칙]
        1. 사주명리 기반 오행·음양 분석 포함
        2. 연애·금전·직업·건강·오늘의 조언 항목 작성
        3. 250~350자
        4. 단정적 표현 금지, 조언 중심
        """.formatted(
                v.getGender(), v.getBirth(), v.getCalendar(), v.getBirthTime()
        );
    }

    private String buildTodayPrompt(FortuneVO v) {
        return """
        아래 정보를 기반으로 한국식 오늘의 운세를 작성해줘.

        [사용자 정보]
        - 성별: %s
        - 생년월일: %s (%s)
        - 태어난 시: %s

        [작성 규칙]
        1. 연애운·금전운·건강운·대인관계·종합운 항목 작성
        2. 200~300자
        3. 실생활에 도움이 되는 조언 포함
        """.formatted(
                v.getGender(), v.getBirth(), v.getCalendar(), v.getBirthTime()
        );
    }

    private String buildStarPrompt(FortuneVO v) {
        return """
        아래 사용자 정보를 기반으로 생년월일로 별자리를 계산하여 오늘의 별자리 운세를 작성해줘.

        [사용자 정보]
        - 성별: %s
        - 생년월일: %s

        [규칙]
        1. 별자리 자동 판별 후 운세 작성
        2. 사랑·금전·감정·행운 포인트 작성
        3. 200~250자
        """.formatted(
                v.getGender(), v.getBirth()
        );
    }

    private String buildZodiacPrompt(FortuneVO v) {
        String year = v.getBirth().substring(0, 4);

        return """
        아래 사용자 정보를 기반으로 띠별 오늘의 운세를 생성해줘.

        [사용자 정보]
        - 성별: %s
        - 생년: %s
        - 생년월일 전체: %s (%s)

        [규칙]
        1. 생년으로 띠 계산 후 운세 작성
        2. 연애·금전·행운·주의점·종합운 항목 작성
        3. 200~250자
        """.formatted(
                v.getGender(), year, v.getBirth(), v.getCalendar()
        );
    }
}
