package com.recharge.movie.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Configuration
public class TmdbConfig {

    @Bean
    public WebClient tmdbWebClient(
            @Value("${tmdb.base.url}") String baseUrl,
            @Value("${tmdb.api.key}") String apiKey,
            @Value("${tmdb.lang}") String lang,
            @Value("${tmdb.region}") String region
    ) {
//        공통 QueryParam 자동 주입
        ExchangeFilterFunction appendDefaultQueryParams = (request, next) -> {
            URI newUri = UriComponentsBuilder.fromUri(request.url())
                    .queryParam("api_key", apiKey)
                    .queryParam("language", lang)
                    .queryParam("region", region)
                    .build(true)
                    .toUri();

            ClientRequest updateRequest = ClientRequest.from(request)
                    .url(newUri)
                    .build();

            return next.exchange(updateRequest);
        };
//      요청 및 응답 로깅
        ExchangeFilterFunction logFilter = (request, next) -> {
            System.out.println("[TMDB] Request -> " + request.method() + " " + request.url());
            return next.exchange(request)
                    .doOnNext(response ->
                            System.out.println("[TMDB] RESPONSE <- status = " + response.statusCode())
                    );
        };

        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("accept", "application/json")
                .filter(appendDefaultQueryParams) // 공통 파라미터 자동 삽입
                .filter(logFilter) // 요청/응답 로깅
                .build();
    }
}
