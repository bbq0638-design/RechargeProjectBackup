package com.recharge.notice.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;


@Getter
@Setter
@NoArgsConstructor
@ToString


public class NoticeVO {

    private Long noticeId;
    private String noticeTitle;
    private String noticeContent;
    private String userId;
    private Long noticeViewCount = 0L; // 신규 공지는 0으로 시작;
    private Timestamp createDate;
    private String createId;
    private Timestamp updatedDate;
    private String updatedId;

}
