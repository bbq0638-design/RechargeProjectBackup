package com.recharge.music.scheduler;

import com.recharge.music.service.ConcertService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ConcertScheduler {

    private final ConcertService concertService;

    //@Scheduled(cron = "0 0 3 * * *")
    public void updateConcerts() {
        concertService.refreshConcerts();
        System.out.println("공연 정보 자동 업데이트 완료");
    }
}