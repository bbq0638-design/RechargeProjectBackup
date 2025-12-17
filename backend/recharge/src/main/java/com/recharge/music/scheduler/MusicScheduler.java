package com.recharge.music.scheduler;

import com.recharge.music.service.MusicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MusicScheduler {

    private final MusicService musicService;

    @Scheduled(cron = "0 0 */6 * * *")
    public void updateWeeklyMusicCharts() {
        log.info(" [Scheduler] Apple Music 인기차트 자동 갱신 시작");

        try {
            musicService.fetchKoreaTop100AndSave();
            musicService.fetchUSTop100AndSave();

            log.info("[Scheduler] Apple Music 인기차트 자동 갱신 완료");

        } catch (Exception e) {
            log.error(" [Scheduler] Apple Music 차트 갱신 중 오류 발생: {}", e.getMessage());
        }
    }
}
