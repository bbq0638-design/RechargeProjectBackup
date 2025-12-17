package com.recharge.music.vo;

import lombok.Data;


@Data
public class MusicVO {
    private Long musicId;
    private String commonCategoryId;
    private String genreName;
    private String genreCode;

    private String musicTitle;
    private String musicSinger;
    private String musicImagePath;
    private String musicFlag;

    private String createDate;
    private String createId;
    private String updatedDate;
    private String updatedId;
}
