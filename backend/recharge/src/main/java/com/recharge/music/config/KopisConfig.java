package com.recharge.music.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class KopisConfig {

    @Bean
    public WebClient kopisWebClient() {
        return WebClient.builder()
                .baseUrl("http://www.kopis.or.kr")   // KOPIS API 메인 URL
                .build();
    }
}