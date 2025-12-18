package com.recharge.movie.tmdb;

import com.recharge.movie.vo.MovieVO;

import java.util.List;
import java.util.Map;
public interface TmdbService {
    
//    제목 기반 검색
    List<MovieVO> searchByTitle(String title);
//    조건 통합 검색
    List<MovieVO> discoverByStrategy(Map<String, Object> strategy);
//    ai 추천 결과 상세 페이지용
    MovieVO getMovieDetail(Long movieId);

//    제목 기반 검색 시 해당 영화와 비슷한 영화 검색으로 좀 더 ai스럽게
    List<MovieVO> searchSimilarByTitle(String title);
}
