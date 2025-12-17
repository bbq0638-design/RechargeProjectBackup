package com.recharge.report.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;
@Getter
@Setter
@NoArgsConstructor
@ToString

public class ReportVO {


    private int reportId;                 // REPORT_ID
    private String reportTargetType;      // REPORT_TARGET_TYPE
    private int reportTargetId;           // REPORT_TARGET_ID
    private String userId;                // USER_ID
    private String reportReason;          // REPORT_REASON
    private Timestamp reportDate;              // REPORT_DATE
    private String reportStatus;          // REPORT_STATUS
    private Timestamp createDate;              // CREATE_DATE
    private String createId;              // CREATE_ID
    private Timestamp updatedDate;             // UPDATED_DATE
    private String updatedId;             // UPDATED_ID
    private String reportTargetUserId;    // REPORT_TARGET_USER_ID


    private int postId;                 // 쿼리에서 AS postId 로 받아온 값
    private String postTitleOrCommentText; // 제목/내용 미리보기
}