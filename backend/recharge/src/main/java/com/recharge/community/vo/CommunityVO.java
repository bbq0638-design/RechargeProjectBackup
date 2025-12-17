package com.recharge.community.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityVO {
    private String categoryId;
    private String categoryName;
    private String categoryCode;

    private int communityPostId;
    private String userId;
    private String communityTitle;
    private String communityContent;
    private String createDate;
    private int communityViewCount;
    private int communityLikeCount;
    private String userNickname;
    private byte[] communityImageData;

    private String hasImage;

    private boolean liked; //좋아요 여부

}
