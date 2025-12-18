package com.recharge.movie.service;

import com.recharge.movie.vo.MovieVO;

import java.util.List;

public interface MovieAiService {
    List<MovieVO> recommend(String message);
}
