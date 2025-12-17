package com.recharge.charger.vo;

import lombok.Data;

import java.util.Date;

@Data
public class ChargerVO {

    private String chargerId;
    private String stationId;
    private String chargerProvider;
    private int chargerTotal;
    private int chargerAvailable;
    private String chargerType;
    private String chargerSpeed;
    private int chargerStatus;
    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;
}
