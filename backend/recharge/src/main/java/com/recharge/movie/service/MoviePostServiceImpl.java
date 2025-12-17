package com.recharge.movie.service;

import com.recharge.movie.dao.MoviePostDAO;
import com.recharge.movie.vo.MoviePostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MoviePostServiceImpl implements MoviePostService {

    private final MoviePostDAO moviePostDAO;
    private final WebClient tmdbWebClient;

    @Override
    public Long createPost(MoviePostVO vo) {
        vo.setCreateId(vo.getUserId());
        vo.setUpdatedId(vo.getUserId());
        moviePostDAO.insertMoviePost(vo);
        return vo.getMoviePostId();
    }

    @Override
    public List<MoviePostVO> getPostList() {
        List<MoviePostVO> list = moviePostDAO.selectAll();

        for (MoviePostVO post : list) {
            Long movieId = post.getMovieId();

            Map<String, Object> detail = tmdbWebClient.get()
                    .uri("/movie/" + movieId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            post.setMovieTitle((String) detail.get("title"));
            post.setMoviePoster("https://image.tmdb.org/t/p/w500" + detail.get("poster_path"));
            post.setMovieScore(Double.valueOf(detail.get("vote_average").toString()));

            // 필요하면 장르도 추가 가능!
        }

        return list;
    }

    @Override
    public MoviePostVO getPostById(Long postId) {

        MoviePostVO post = moviePostDAO.selectById(postId);
        if (post == null) return null;

        Long movieId = post.getMovieId();

        //  TMDB 상세 정보
        Map<String, Object> detail = tmdbWebClient.get()
                .uri("/movie/" + movieId)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        //  TMDB Credits
        Map<String, Object> credits = tmdbWebClient.get()
                .uri("/movie/" + movieId + "/credits")
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        //  TMDB Videos
        Map<String, Object> videos = tmdbWebClient.get()
                .uri("/movie/" + movieId + "/videos")
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        // ⭐ VO에 세팅
        post.setMovieTitle((String) detail.get("title"));
        post.setMoviePoster("https://image.tmdb.org/t/p/w500" + detail.get("poster_path"));
        post.setMovieComment((String) detail.get("overview"));
        post.setMovieDate(parseDate((String) detail.get("release_date")));
        post.setMovieDirector(getDirector(credits));
        post.setMovieActor(getActors(credits));
        post.setMovieTrailer(getTrailer(videos));

        Object scoreObj = detail.get("vote_average");
        if (scoreObj != null) {
            post.setMovieScore(Double.valueOf(scoreObj.toString()));
        }

        List<Map<String, Object>> genres = (List<Map<String, Object>>) detail.get("genres");

        if (genres != null && !genres.isEmpty()) {
            // TMDB 장르 코드(ex: 28, 35)
            String tmdbCode = String.valueOf(genres.get(0).get("id"));

            // 우리 DB에서 장르 찾기
            Map<String, Object> category = moviePostDAO.findByTmdbCode(tmdbCode);

            if (category != null) {
                post.setGenreName((String) category.get("COMMON_CATEGORY_NAME"));
                post.setGenreCode((String) category.get("COMMON_CATEGORY_CODE"));
                post.setCommonCategoryId((String) category.get("COMMON_CATEGORY_ID")); // 필요하면 추가
            }
        }

        return post;
    }

    private Date parseDate(String str) {
        if (str == null) return null;
        try {
            return Date.valueOf(LocalDate.parse(str)); // java.sql.Date
        } catch (Exception e) {
            return null;
        }
    }

    private String getDirector(Map<String, Object> credits) {
        List<Map<String, Object>> crew = (List<Map<String, Object>>) credits.get("crew");
        if (crew == null) return null;

        return crew.stream()
                .filter(c -> "Director".equals(c.get("job")))
                .map(c -> (String) c.get("name"))
                .findFirst()
                .orElse(null);
    }

    private String getActors(Map<String, Object> credits) {
        List<Map<String, Object>> cast = (List<Map<String, Object>>) credits.get("cast");
        if (cast == null) return null;

        return cast.stream()
                .limit(5)
                .map(c -> (String) c.get("name"))
                .collect(Collectors.joining(", "));
    }

    private String getTrailer(Map<String, Object> videos) {
        List<Map<String, Object>> list = (List<Map<String, Object>>) videos.get("results");
        if (list == null) return null;

        return list.stream()
                .filter(v -> "Trailer".equals(v.get("type")))
                .map(v -> "https://www.youtube.com/watch?v=" + v.get("key"))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<MoviePostVO> getUserMoviePosts(String userId) {
        List<MoviePostVO> list = moviePostDAO.selectByUserId(userId);

        for (MoviePostVO post : list) {
            Long movieId = post.getMovieId();

            Map<String, Object> detail = tmdbWebClient.get()
                    .uri("/movie/" + movieId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            post.setMoviePoster("https://image.tmdb.org/t/p/w500" + detail.get("poster_path"));
            post.setMovieTitle((String) detail.get("title"));
        }

        return list;
    }

    @Override
    public void updatePost(MoviePostVO vo) {
        vo.setUpdatedId(vo.getUserId()); // 수정자 = 로그인 유저
        moviePostDAO.updateMoviePost(vo);
    }

    @Override
    public void deletePost(Long postId) {
        moviePostDAO.deletePost(postId);
    }
}
