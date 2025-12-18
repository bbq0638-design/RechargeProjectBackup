package com.recharge.movie.tmdb;

import com.fasterxml.jackson.databind.JsonNode;
import com.recharge.movie.dao.MovieDAO;
import com.recharge.movie.vo.MovieVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TmdbServiceImpl implements TmdbService{

    private final WebClient tmdbWebClient;
    private final MovieDAO movieDAO;

    private static final String TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
    private static final String YOUTUBE_WATCH_BASE = "https://www.youtube.com/watch?v=";

//    제목으로 찾기
    @Override
    public List<MovieVO> searchByTitle(String title) {
        JsonNode res = tmdbWebClient.get()
                .uri(u -> u.path("/search/movie")
                        .queryParam("query", title)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        List<MovieVO> list = new ArrayList<>();
        if (res == null || res.get("results") == null) return list;

        for (JsonNode movie : res.get("results")) {
            list.add(basicMovie(movie));
        }

        return list;
    }
// 조건 검색 분기 (discover)
    @Override
    public List<MovieVO> discoverByStrategy (Map<String, Object> strategy) {
        if (strategy == null || strategy.isEmpty()) {
            return List.of();
        }

        JsonNode res = tmdbWebClient.get()
                .uri(uri -> {
                    var b = uri.path("/discover/movie");
                    b.queryParam("include_adult", false);
                    b.queryParam("language", "ko-KR");
                    b.queryParam("page", 1);

                    if (strategy.containsKey("prefer_genres")) {
                        List<?> genres = (List<?>) strategy.get("prefer_genres");
                        b.queryParam(
                                "with_genres",
                                genres.stream()
                                        .map(Object::toString)
                                        .collect(Collectors.joining(","))
                        );
                    }

                    if (strategy.containsKey("min_vote")) {
                        b.queryParam("vote_average.gte", strategy.get("min_vote"));
                        b.queryParam("vote_count.gte", 100);
                    }

                    if (strategy.containsKey("sort_by")) {
                        b.queryParam("sort_by", strategy.get("sort_by"));
                    }

                    return b.build();
                })
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        List<MovieVO> list = new ArrayList<>();
        if (res == null || res.get("results") == null) return list;

        for (JsonNode movie : res.get("results")) {
            list.add(basicMovie(movie));
        }
        return list;
    }

//    검색된 영화 상세 조회용
@Override
public MovieVO getMovieDetail(Long movieId) {

    // 기본 정보
    Map<String, Object> detail =
            tmdbWebClient.get()
                    .uri("/movie/{id}", movieId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

    if (detail == null) return null;

    MovieVO vo = new MovieVO();
    vo.setMovieId(movieId);
    vo.setMovieTitle((String) detail.get("title"));

    if (detail.get("poster_path") != null)
        vo.setMoviePoster(TMDB_IMAGE_BASE + detail.get("poster_path"));

    vo.setMovieScore(Double.valueOf(detail.get("vote_average").toString()));
    vo.setMovieComment((String) detail.get("overview"));
    vo.setMovieDate((String) detail.get("release_date"));

    // 장르
    List<Map<String, Object>> genres =
            (List<Map<String, Object>>) detail.get("genres");

    if (genres != null && !genres.isEmpty()) {
        String genreCode = genres.get(0).get("id").toString();
        vo.setGenreCode(genreCode);
        vo.setCommonCategoryId(
                movieDAO.findCategoryId("TMDB", genreCode)
        );
    }

    // 출연진 / 감독
    Map<String, Object> credits =
            tmdbWebClient.get()
                    .uri("/movie/{id}/credits", movieId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

    if (credits != null) {
        List<Map<String, Object>> crew =
                (List<Map<String, Object>>) credits.get("crew");

        if (crew != null) {
            crew.stream()
                    .filter(c -> "Director".equals(c.get("job")))
                    .findFirst()
                    .ifPresent(d ->
                            vo.setMovieDirector((String) d.get("name")));
        }

        List<Map<String, Object>> cast =
                (List<Map<String, Object>>) credits.get("cast");

        if (cast != null) {
            String actors = cast.stream()
                    .map(c -> (String) c.get("name"))
                    .filter(n -> n != null && !n.isBlank())
                    .limit(5)
                    .collect(Collectors.joining(", "));
            vo.setMovieActor(actors);
        }
    }

    // 트레일러
    Map<String, Object> videos =
            tmdbWebClient.get()
                    .uri("/movie/{id}/videos", movieId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

    if (videos != null) {
        List<Map<String, Object>> results =
                (List<Map<String, Object>>) videos.get("results");

        if (results != null) {
            results.stream()
                    .filter(v -> "YouTube".equalsIgnoreCase((String) v.get("site")))
                    .map(v -> (String) v.get("key"))
                    .findFirst()
                    .ifPresent(key ->
                            vo.setMovieTrailer(YOUTUBE_WATCH_BASE + key));
        }
    }

    return vo;
}

// movieVO 맞춤 리스트 형식
    private MovieVO basicMovie(JsonNode movie) {
        MovieVO vo = new MovieVO();
        vo.setMovieId(movie.get("id").asLong());
        vo.setMovieTitle(movie.get("title").asText());
        vo.setMovieScore(movie.get("vote_average").asDouble());
        vo.setMovieComment(movie.get("overview").asText());
        vo.setMovieDate(movie.get("release_date").asText());

        if (movie.has("poster_path") && !movie.get("poster_path").isNull()) {
            vo.setMoviePoster(TMDB_IMAGE_BASE + movie.get("poster_path").asText());
        }

        if (movie.has("genre_ids") && movie.get("genre_ids").isArray()) {
            JsonNode genreIds = movie.get("genre_ids");

            if (genreIds.size() > 0) {
                String genreCode = genreIds.get(0).asText(); // 대표 장르 1개
                vo.setGenreCode(genreCode);

                vo.setCommonCategoryId(
                        movieDAO.findCategoryId("TMDB", genreCode)
                );
            }
        }
        return vo;
    }

    @Override
    public List<MovieVO> searchSimilarByTitle(String title) {

        // 제목으로 기준 영화 검색
        List<MovieVO> seeds = searchByTitle(title);
        if (seeds.isEmpty()) return List.of();

        Long seedMovieId = seeds.get(0).getMovieId();

        //  TMDB similar API 호출
        JsonNode res = tmdbWebClient.get()
                .uri("/movie/{id}/similar", seedMovieId)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        List<MovieVO> list = new ArrayList<>();
        if (res == null || res.get("results") == null) return list;

        for (JsonNode movie : res.get("results")) {
            if (movie.get("id").asLong() == seedMovieId) continue;
            list.add(basicMovie(movie));
        }

        return list;
    }
}
