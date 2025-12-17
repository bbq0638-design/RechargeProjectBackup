package com.recharge.music.vo;

import lombok.Data;

import java.util.List;

@Data
public class MusicPostVO {
    private Long musicPostId;
    private String userId;
    private String userNickname;

    private String musicPostTitle;
    private String musicPostText;

    private String createId;
    private String createDate;
    private String updatedId;
    private String updatedDate;

    private String firstImagePath;

    private List<MusicListVO> playlist;

}
