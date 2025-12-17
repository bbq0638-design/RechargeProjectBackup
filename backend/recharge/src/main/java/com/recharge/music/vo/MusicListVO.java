package com.recharge.music.vo;

import lombok.Data;

@Data
public class MusicListVO {
    private Long musicListId;
    private Long musicPostId;

    private Long musicId;          // iTunes trackId
    private String musicTitle;
    private String musicSinger;
    private String musicImagePath;
    private String musicPreviewUrl;

    private String createId;
    private String createDate;
    private String updatedId;
    private String updatedDate;
}