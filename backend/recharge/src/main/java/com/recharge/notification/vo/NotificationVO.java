package com.recharge.notification.vo;

import lombok.Data;

@Data
public class NotificationVO {
    private Long notiId;
    private String receiverId;
    private String senderId;
    private String notiType;
    private String message;
    private String targetType;
    private String targetId;
    private String isRead;
    private String createDate;
}
