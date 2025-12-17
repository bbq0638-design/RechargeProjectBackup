package com.recharge.movie.vo;

import java.util.Date;
import lombok.Data;

@Data
public class MoviePostVO {
    private Long moviePostId;
    private String userId;
    private String userNickname;
    private Long movieId;
    private String moviePostTitle;
    private String moviePostText;
    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;

    // join fields
    private String movieTitle;
    private String moviePoster;
    private Double movieScore;
    private String movieDirector;
    private String movieActor;
    private String movieTrailer;
    private String genreName;
    private String genreCode;
    private String commonCategoryId;
    private Date movieDate;
    private String movieComment;
}
