package com.recharge.movie.dao;

import com.recharge.movie.vo.MoviePostVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MoviePostDAO {
    Long getNextPostId();

    void insertMoviePost(MoviePostVO vo);

    List<MoviePostVO> selectAll();

    MoviePostVO selectById(Long postId);

    Map<String, Object> findByTmdbCode(String code);

    List<MoviePostVO> selectByUserId(String userId);

    void updateMoviePost(MoviePostVO vo);

    void deletePost(Long postId);
}
