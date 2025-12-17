package com.recharge.station.vo;

import lombok.Data;

import java.util.Date;

@Data
public class StationVO {
    private String stationId;
    private String stationName;
    private double stationLatitude;
    private double stationLongitude;
    private String stationAddress;
    private String stationAddressDetail;
    private String stationParkingFree;
    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;

    private Double distance;

    private int chargerTotal;
    private int chargerAvailable;
    private String chargerTypes;
    private String chargerSpeeds;
    private String chargerProviders;



}
