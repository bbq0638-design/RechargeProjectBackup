package com.recharge.music.vo;

import lombok.Data;

@Data
public class ConcertVO {
    private Long concertId;       // 시퀀스
    private String title;
    private String poster;
    private String startDate;
    private String endDate;
}
