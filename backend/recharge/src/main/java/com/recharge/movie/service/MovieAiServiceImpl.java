package com.recharge.movie.service;

import com.recharge.movie.tmdb.TmdbService;
import com.recharge.movie.vo.MovieVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MovieAiServiceImpl implements MovieAiService {

    private final WebClient aiWebClient;
    private final TmdbService tmdbService;

    @Override
    public List<MovieVO> recommend(String message) {

        Map<String, Object> aiResponse =
                aiWebClient.post()
                        .uri("/movie/ai")
                        .bodyValue(Map.of("message", message))
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

        Map<String, Object> result =
                (Map<String, Object>) aiResponse.get("result");

        String intent = (String) result.get("intent");
        Map<String, Object> payload =
                (Map<String, Object>) result.get("payload");

        switch (intent) {
            case "SIMILAR_BY_TITLE":
                return tmdbService.searchSimilarByTitle(
                        (String) payload.get("seedTitle")
                ).stream()
                .limit(10)
                .toList();

            case "WEATHER":
            case "MOOD":
            case "GENRE_EXPLICIT":
            case "RECHARGE_IMMERSIVE_CONTINUE":
                return tmdbService.discoverByStrategy(payload).stream()
                .limit(10)
                .toList();

            default:
                return tmdbService.searchByTitle(message)
                .stream()
                .limit(10)
                .toList();
        }
    }
}
