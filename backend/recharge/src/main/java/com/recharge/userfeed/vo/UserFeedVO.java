package com.recharge.userfeed.vo;

import lombok.Data;

import java.util.Date;

@Data
public class UserFeedVO {

    private String userId;
    private Integer totalCount;
    private Integer totalFollower;
    private Integer totalFollowing;

    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;

    private String userNickname;

}
