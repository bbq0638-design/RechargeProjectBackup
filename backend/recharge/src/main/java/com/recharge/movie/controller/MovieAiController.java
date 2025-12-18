package com.recharge.movie.controller;

import com.recharge.movie.service.MovieAiService;
import com.recharge.movie.vo.MovieVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/movie/ai")
public class MovieAiController {

    private final MovieAiService movieAiService;

    @PostMapping
    public List<MovieVO> recommend(@RequestBody Map<String, String> body) {
        String message = body.get("message");
        return movieAiService.recommend(message);
    }

}
