package com.recharge.bookmark.vo;

import lombok.Data;

import java.util.Date;

@Data
public class BookmarkVO {

    private Long bookmarkId;
    private String bookmarkTargetType;
    private Long bookmarkTargetId;
    private String userId;

    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;


    private String title;
    private String image;


    private Long movieId;
    private String movieTitle;
    private String moviePoster;


    private Long moviePostId;
    private String moviePostTitle;
    private String postImage;


    private Long musicId;
    private String musicTitle;
    private String musicSinger;
    private String musicImagePath;


    private Long musicListId;
    private String listMusicTitle;
    private String listMusicSinger;
    private String listMusicImage;
}