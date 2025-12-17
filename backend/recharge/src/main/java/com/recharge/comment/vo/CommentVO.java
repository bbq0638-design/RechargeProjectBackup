package com.recharge.comment.vo;

import lombok.Data;

import java.sql.Date;


@Data
public class CommentVO {
    private int commentId;
    private String targetType; // 구분값 (MOVIE, MUSIC)
    private String targetId; // 해당 컨텐츠 ID
    private String userId;
    private String commentText;

    //조인해서 가져올 필드
    private String userNickname;
    private String userRole;

    private Date createDate;
    private Date updateDate;
    private String createId;
    private String updatedId;
}
