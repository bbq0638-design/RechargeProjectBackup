package com.recharge.notification.dao;

import com.recharge.notification.vo.NotificationVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface NotificationDAO {
    void insertNotification(NotificationVO notificationVO);
    List<NotificationVO> selectNotificationsByUserId(String userId);
    void updateNotificationRead(Long notiId);

    // 작성자 조회
    String getBoardWriter(Long postId);
    String getMoviePostWriter(Long postId);
    String getMusicPostWriter(Long postId);

    //제목 조회 메서드
    String getBoardTitle(Long postId);
    String getMoviePostTitle(Long postId);
    String getMusicPostTitle(Long postId);

    String getUserFcmToken(String userId);
    String getUserNickname(String userId);
}