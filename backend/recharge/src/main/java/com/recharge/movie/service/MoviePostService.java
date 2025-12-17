package com.recharge.movie.service;

import com.recharge.movie.vo.MoviePostVO;

import java.util.List;

public interface MoviePostService {

    Long createPost(MoviePostVO vo);

    List<MoviePostVO> getPostList();

    MoviePostVO getPostById(Long postId);

    List<MoviePostVO> getUserMoviePosts(String userId);

    void updatePost(MoviePostVO vo);

    void deletePost(Long postId);
}
