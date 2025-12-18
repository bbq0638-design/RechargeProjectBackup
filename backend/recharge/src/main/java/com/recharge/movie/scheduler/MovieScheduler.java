package com.recharge.movie.scheduler;


import com.recharge.movie.service.MovieService;
import com.recharge.movie.vo.MovieVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class MovieScheduler {

    private final MovieService movieService;

//    하루에 한번 실행
//    30초 씩 저장
//    @Scheduled(cron = "0/30 * * * * *")
//    6시간 간격  저장
    @Scheduled(cron = "0 0 */6 * * *")
    public void updatePopularMovieJob() {
        log.info("인기 영화 배치 실행 조건 검증 시작");

        if(!movieService.needToUpdatePopular()){
            log.info("조건 미충족 -> 인기 영화 갱신 무시");
            return;
        }

        log.info("인기 영화 갱신 중");

//        tmdb 호출
        List<MovieVO> popularList = movieService.fetchPopularMovies(4);
        movieService.refreshPopularMovies(popularList);

        log.info("인기 영화 갱신 완료");
    }

    @Scheduled(cron = "0 0 3 * * *")
    public void refreshUpcoming() {
        movieService.getUpcomingMovies();
    }

    @Scheduled(cron = "0 0 3 ? * MON")
    public void refreshUpcomingWeekly() {
        movieService.refreshUpcomingMoviesWeekly();
    }
}


