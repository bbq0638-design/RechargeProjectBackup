package com.recharge.music.config;


import lombok.Getter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Getter
@Configuration
public class MusicConfig {
//100곡은 프론트 과부화 문제로 50곡으로 새로 조정
    private final String KR_TOP100_URL =
            "https://rss.applemarketingtools.com/api/v2/kr/music/most-played/50/songs.json";

    private final String US_TOP100_URL =
            "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/songs.json";



    /**  Apple RSS / iTunes 용 전용 WebClient */
    @Bean
    public WebClient appleWebClient() {
        return WebClient.builder()
                .baseUrl("https://rss.applemarketingtools.com")
                .clientConnector(
                        new ReactorClientHttpConnector(
                                HttpClient.create().followRedirect(true)
                        )
                )
                .defaultHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")// 공통 base
                .build(); // TMDB 기본 파라미터 없음!
    }

    /**  iTunes Search 용 WebClient */
    @Bean
    public WebClient itunesWebClient() {
        return WebClient.builder()
                .baseUrl("https://itunes.apple.com")
                .defaultHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .build();
    }
    
}
