package com.recharge.movie.controller;

import com.recharge.movie.service.MovieService;
import com.recharge.movie.vo.MovieVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movie")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping("/upcoming")
    public List<MovieVO> getUpcomingMovies() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("=== Controller Authentication ===");
        System.out.println(auth);


        return movieService.getUpcomingMovies();
    }
    //    저장된 인기 영화 가져오기
    @GetMapping("/popular")
    public List<MovieVO> getPopularMovies() {
        return movieService.getPopularMovies();
    }
//    영화 상세 정보 불러오기
    @GetMapping("/{movieId}")
    public MovieVO getMovieDetail(@PathVariable Long movieId) {
        return movieService.getMovieDetail(movieId);
    }

//    영화 추천 게시글 내 검색기능
    @GetMapping("/search")
    public ResponseEntity<?> searchMovies(@RequestParam String query) {
        return ResponseEntity.ok(movieService.searchMovie(query));
    }

//    비슷한 장르 추천 호출
     @GetMapping("/{movieId}/similar")
     public List<MovieVO> getSimilarMovies(@PathVariable Long movieId) {
        return movieService.getSimilarMovies(movieId);
        }
}

