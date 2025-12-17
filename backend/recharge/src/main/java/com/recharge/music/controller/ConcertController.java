package com.recharge.music.controller;

import com.recharge.music.service.ConcertService;
import com.recharge.music.vo.ConcertVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/concert")
@RequiredArgsConstructor
public class ConcertController {

    private final ConcertService concertService;

    @GetMapping("/top")
    public List<ConcertVO> getTopConcerts() {
        return concertService.getConcerts();
    }
}
