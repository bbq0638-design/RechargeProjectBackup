package com.recharge.follow.vo;

import lombok.Data;

import java.util.Date;

@Data
public class FollowVO {

    private Long followId;

    private String followerId;    // 나를 팔로우한 사람
    private String followingId;   // 내가 팔로우한 사람

    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;

    private String targetUserId;   // 화면에서 필요한 유저ID
    private String userNickname;   // 조인해서 가져온 닉네임
    private int isFollowing; // 0 또는 1 (맞팔 여부)
}
