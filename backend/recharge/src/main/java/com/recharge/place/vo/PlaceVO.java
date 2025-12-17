package com.recharge.place.vo;

import lombok.Data;

import java.util.Date;

@Data
public class PlaceVO {
    private Long placeId;
    private String placeName;
    private String categoryId;
    private String placeAddress;
    private String placeAddressDetail;
    private String placePhone;
    private Double placeLatitude;
    private Double placeLongitude;
    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;
    private String categoryName;
    private String categoryCode;
    private String kakaoPlaceId;
}
