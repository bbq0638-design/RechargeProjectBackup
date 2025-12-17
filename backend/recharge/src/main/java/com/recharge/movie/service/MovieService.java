package com.recharge.movie.service;

import com.recharge.movie.vo.MovieVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface MovieService {

    List<MovieVO> getUpcomingMovies();



    //    인기영화 새로고침(삭제 후 저장)
    void refreshPopularMovies(List<MovieVO> movieList);
//    인기 영화 조회
    List<MovieVO> getPopularMovies();

    boolean needToUpdatePopular();
    //   인기 영화 tmdb 에서 가져오기
    public List<MovieVO> fetchPopularMovies(int totalPage);
// 영화 상세 정보
    MovieVO getMovieDetail(Long movieId);
//    영화 검색
    List<MovieVO> searchMovie(String query);
// 비슷한 장르 추천
    public List<MovieVO> getSimilarMovies(Long movieId);


}
