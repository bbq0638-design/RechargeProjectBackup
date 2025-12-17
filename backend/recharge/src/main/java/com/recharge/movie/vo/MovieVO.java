package com.recharge.movie.vo;


import lombok.Data;



@Data
public class MovieVO {
    private Long movieId;
    private String commonCategoryId;
    private String moviePoster;
    private String movieTitle;

    private Double movieScore;
    private String movieComment;

    private String genreName;
    private String genreCode;
    private String movieDirector;
    private String movieActor;

    private String movieDate;
    private String movieTrailer;

    private String createDate;
    private String createId;
    private String updatedDate;
    private String updatedId;

    private String movieFlag;
}
