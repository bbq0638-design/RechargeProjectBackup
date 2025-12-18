package com.recharge.movie.dao;

import com.recharge.movie.vo.MovieVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface MovieDAO {
//    최신 영화 조회
    List<MovieVO> selectUpcomingMovies();
// 인기 영화 1주 갱신 후 삭제
    int deletePopularMovies();
// 인기 영화 갱신 후 db 삽입
    int insertPopularMovie(MovieVO movieVO);
//인기 영화 리스트 출력
    List<MovieVO> selectWeeklyPopularMovies();
//인기 영화 게시 날짜 조회
    String getLatestPopularCreateDate();

    String findCategoryId(@Param("system") String system,
    @Param("code") String code);

    MovieVO selectMovieById(Long movieId);
// 영화 중복 insert 방지
    boolean existsByMovieId(Long movieId);
// 비슷한 영화 추천/db저장
    void insertSimilarMovie(MovieVO vo);
// 비슷한 영화 없을 경우 db에서 아무 영화 추천
    List<MovieVO> findRandomMovies();

    Map<String, String> findCategoryByTmdbCode(
            @Param("system") String system,
            @Param("code") String code
    );
}
