package com.recharge.movie.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.recharge.movie.dao.MovieDAO;
import com.recharge.movie.vo.MovieVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final WebClient tmdbWebClient;
    private final MovieDAO movieDAO;

    private static final String TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
    private static final String YOUTUBE_WATCH_BASE = "https://www.youtube.com/watch?v=";

    /** ---------------------------------------------------------
     *  TMDB 상세 1회 호출 → MovieVO 생성 (flag 없음)
     * --------------------------------------------------------- */
    public MovieVO getTmdbMovieDetail(Long movieId) {

        //  1) 기본 정보 조회
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
        Object poster = detail.get("poster_path");
        if (poster != null) vo.setMoviePoster(TMDB_IMAGE_BASE + poster);

        Object score = detail.get("vote_average");
        if (score != null) vo.setMovieScore(Double.valueOf(score.toString()));

        if (detail.get("overview") != null)
            vo.setMovieComment(detail.get("overview").toString());

        if (detail.get("release_date") != null)
            vo.setMovieDate(detail.get("release_date").toString());

        // ⭐ 장르 처리
        List<Map<String, Object>> genres = (List<Map<String, Object>>) detail.get("genres");
        if (genres != null && !genres.isEmpty()) {
            String genreCode = genres.get(0).get("id").toString();
            vo.setGenreCode(genreCode);
            vo.setCommonCategoryId(movieDAO.findCategoryId("TMDB", genreCode));
        }

        // ⭐ 2) 감독/배우 정보 조회
        Map<String, Object> credits =
                tmdbWebClient.get()
                        .uri("/movie/{id}/credits", movieId)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

        if (credits != null) {
            List<Map<String, Object>> crew = (List<Map<String, Object>>) credits.get("crew");

            if (crew != null) {
                crew.stream()
                        .filter(c -> "Director".equals(c.get("job")))
                        .findFirst()
                        .ifPresent(d -> vo.setMovieDirector((String) d.get("name")));
            }

            List<Map<String, Object>> cast = (List<Map<String, Object>>) credits.get("cast");
            if (cast != null) {
                String actors = cast.stream()
                        .map(c -> (String) c.get("name"))
                        .filter(n -> n != null && !n.isBlank())
                        .limit(5)
                        .collect(Collectors.joining(", "));
                vo.setMovieActor(actors);
            }
        }

        // ⭐ 3) 예고편 조회
        Map<String, Object> videoMap =
                tmdbWebClient.get()
                        .uri("/movie/{id}/videos", movieId)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

        if (videoMap != null) {
            List<Map<String, Object>> videoResults =
                    (List<Map<String, Object>>) videoMap.get("results");

            if (videoResults != null) {
                videoResults.stream()
                        .filter(v -> "YouTube".equalsIgnoreCase((String) v.get("site")))
                        .map(v -> (String) v.get("key"))
                        .findFirst()
                        .ifPresent(key -> vo.setMovieTrailer(YOUTUBE_WATCH_BASE + key));
            }
        }
        if (genres != null && !genres.isEmpty()) {
            String genreCode = genres.get(0).get("id").toString();

            Map<String, String> category =
                    movieDAO.findCategoryByTmdbCode("TMDB", genreCode);

            if (category != null) {
                vo.setGenreCode(category.get("COMMON_CATEGORY_CODE"));
                vo.setGenreName(category.get("COMMON_CATEGORY_NAME"));
                vo.setCommonCategoryId(category.get("COMMON_CATEGORY_ID"));
            }
        }


        return vo;
    }

    /** ---------------------------------------------------------
     *  convertMovie: TMDB 상세 조회 + flag 적용
     * --------------------------------------------------------- */
    private MovieVO convertMovie(Long tmdbId, String flag) {

        MovieVO vo = getTmdbMovieDetail(tmdbId);
        if (vo == null) return null;


        vo.setMovieFlag(flag);
        return vo;
    }

    /** ---------------------------------------------------------
     *  업커밍 영화 조회
     * --------------------------------------------------------- */
    @Override
    public List<MovieVO> getUpcomingMovies() {
        return movieDAO.selectUpcomingMovies();
    }
    @Transactional
    public void refreshUpcomingMoviesWeekly() {

        // 1️⃣ 기존 UPCOMING 전부 제거
        movieDAO.deleteUpcomingMovies();

        // 2️⃣ TMDB upcoming 재조회
        Map<String, Object> response =
                tmdbWebClient.get()
                        .uri("/movie/upcoming")
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

        if (response == null) return;

        List<Map<String, Object>> results =
                (List<Map<String, Object>>) response.get("results");
        if (results == null) return;

        results.stream()
                .limit(10)
                .forEach(item -> {
                    Long movieId = Long.valueOf(item.get("id").toString());
                    MovieVO vo = convertMovie(movieId, "UPCOMING");
                    if (vo == null) return;

                    if (movieDAO.existsByMovieId(vo.getMovieId())) {
                        movieDAO.updateMovieFlag(vo.getMovieId(), "UPCOMING");
                    } else {
                        movieDAO.insertMovie(vo);
                    }
                });
    }


    /** ---------------------------------------------------------
     *  인기 영화 저장용
     * --------------------------------------------------------- */
    @Override
    public List<MovieVO> fetchPopularMovies(int totalPage) {
        List<MovieVO> list = new ArrayList<>();

        for (int page = 1; page <= totalPage; page++) {
            int finalPage = page;
            Map<String, Object> response =
                    tmdbWebClient.get()
                            .uri(builder -> builder
                                    .path("/movie/popular")
                                    .queryParam("page", finalPage)
                                    .build()
                            )
                            .retrieve()
                            .bodyToMono(Map.class)
                            .block();

            if (response == null) continue;

            List<Map<String, Object>> results =
                    (List<Map<String, Object>>) response.get("results");

            if (results == null) continue;

            results.forEach(item -> {
                Long movieId = Long.valueOf(item.get("id").toString());

                if (movieDAO.existsByMovieId(movieId)) {
                    System.out.println("중복 영화 skip → " + movieId);
                    return;
                }

                double voteAvg =
                        Double.parseDouble(item.get("vote_average").toString());
                int voteCount =
                        Integer.parseInt(item.get("vote_count").toString());

                // 별점 6.5이상/ 평가수 500개 이상 필터링
                if (voteAvg < 6.5 || voteCount < 500) {
                    System.out.println("인기 필터 제외 → " + movieId);
                    return;
                }

                MovieVO vo = convertMovie(movieId, "POPULAR");
                if (vo != null) {
                    list.add(vo);
                }
            });
        }
        return list;
    }

    @Override
    @Transactional
    public void refreshPopularMovies(List<MovieVO> movieList) {
        movieDAO.deletePopularMovies();
        for (MovieVO vo : movieList) {
            movieDAO.insertMovie(vo);
        }
    }

    @Override
    public List<MovieVO> getPopularMovies() {
        return movieDAO.selectWeeklyPopularMovies();
    }

    @Override
    public boolean needToUpdatePopular() {
        String latestDateStr = movieDAO.getLatestPopularCreateDate();
        if (latestDateStr == null) return true;

        LocalDate latest = LocalDate.parse(latestDateStr);
        LocalDate now = LocalDate.now();
        return latest.plusDays(7).isEqual(now) || latest.plusDays(7).isBefore(now);
    }

    /** ---------------------------------------------------------
     *  ⭐ 상세 조회: DB → TMDB fallback 방식
     * --------------------------------------------------------- */
    @Override
    public MovieVO getMovieDetail(Long movieId) {

        // 1) 먼저 DB 조회
        MovieVO vo = movieDAO.selectMovieById(movieId);
        if (vo != null) return vo;

        // 2) DB에 없으면 TMDB 호출
        return getTmdbMovieDetail(movieId);
    }

    /** ---------------------------------------------------------
     *  TMDB 영화 검색
     * --------------------------------------------------------- */
    @Override
    public List<MovieVO> searchMovie(String query) {

        JsonNode res = tmdbWebClient.get()
                .uri(u -> u.path("/search/movie")
                        .queryParam("query", query).build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        List<MovieVO> list = new ArrayList<>();

        for (JsonNode movie : res.get("results")) {
            MovieVO vo = new MovieVO();
            vo.setMovieId(movie.get("id").asLong());
            vo.setMovieTitle(movie.get("title").asText());

            if (movie.has("poster_path") && !movie.get("poster_path").isNull())
                vo.setMoviePoster(TMDB_IMAGE_BASE + movie.get("poster_path").asText());

            vo.setMovieScore(movie.get("vote_average").asDouble());
            vo.setMovieComment(movie.get("overview").asText());
            vo.setMovieDate(movie.get("release_date").asText());

            list.add(vo);
        }

        return list;
    }

    @Override
    public List<MovieVO> getSimilarMovies(Long movieId) {

        // 1) TMDB similar API 조회
        Map<String, Object> response = tmdbWebClient.get()
                .uri("/movie/{id}/similar", movieId)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<MovieVO> list = new ArrayList<>();

        List<Map<String, Object>> results =
                response == null ? null : (List<Map<String, Object>>) response.get("results");

        // TMDB가 similar을 제공한 경우
        if (results != null && !results.isEmpty()) {

            results.stream().limit(6).forEach(item -> {
                Long similarId = Long.valueOf(item.get("id").toString());

                MovieVO vo = convertMovie(similarId, "SIMILAR");
                if (vo == null) return;

                list.add(vo);

                if (!movieDAO.existsByMovieId(vo.getMovieId())) {
                    movieDAO.insertMovie(vo);
                }
            });

            // TMDB similar이 존재하면 그대로 return
            if (!list.isEmpty()) return list;
        }

        // fallback: DB 랜덤 6개
        System.out.println("TMDB similar 없음 → fallback: DB 랜덤 추천!");

        List<MovieVO> randomList = movieDAO.findRandomMovies();

        return randomList.stream().limit(6).toList();
    }


}
