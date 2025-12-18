package com.recharge.movie.dao;

import com.recharge.movie.vo.MovieVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface MovieDAO {

    void insertMovie(MovieVO vo);

    boolean existsByMovieId(Long movieId);

    // 조회/삭제는 기존 그대로
    void deletePopularMovies();
    List<MovieVO> selectWeeklyPopularMovies();

    MovieVO selectMovieById(Long movieId);
    String getLatestPopularCreateDate();

    List<MovieVO> findRandomMovies();

    String findCategoryId(String system, String code);
    Map<String, String> findCategoryByTmdbCode(String system, String code);

    void deleteUpcomingMovies();
    void updateMovieFlag(Long movieId, String movieFlag);

    List<MovieVO> selectUpcomingMovies();
}

