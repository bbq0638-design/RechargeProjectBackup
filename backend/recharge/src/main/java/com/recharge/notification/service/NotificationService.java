package com.recharge.notification.service;

import com.recharge.fcm.service.FcmService;
import com.recharge.notification.dao.NotificationDAO;
import com.recharge.notification.vo.NotificationVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationDAO notificationDAO;

    @Autowired(required = false)
    private FcmService fcmService;

    // 테스트용 단순 저장
    public void insertNotification(NotificationVO vo) {
        notificationDAO.insertNotification(vo);
    }

    /**
     * 알림 전송 로직 (제목 + 닉네임 + FCM 푸시)
     */
    @Transactional
    public void sendNotification(String senderId, String targetType, String targetId, String type) {

        String receiverId = null;
        String postTitle = "";

        try {
            // ★ 팔로우 알림일 경우 (targetId가 아이디 문자열)
            if ("follow".equals(targetType)) {
                receiverId = targetId; // 팔로우 당하는 사람 아이디를 바로 타겟으로 설정
                postTitle = "마이페이지"; // 제목 대신 표시할 텍스트
            }
            // ★ 그 외 게시글 알림일 경우 (targetId가 게시글 번호 숫자)
            else {
                long postId = Long.parseLong(targetId); // 여기서 숫자로 변환
            // 게시판 타입에 따라 작성자(receiverId)와 제목(postTitle) 조회
            switch (targetType) {
                case "boardcomment":
                case "boardpost":
                case "boardlike":
                    receiverId = notificationDAO.getBoardWriter(postId);
                    postTitle = notificationDAO.getBoardTitle(postId);
                    break;
                case "moviecomment":
                case "moviepost":
                    receiverId = notificationDAO.getMoviePostWriter(postId);
                    postTitle = notificationDAO.getMoviePostTitle(postId);
                    break;
                case "musiccomment":
                case "musicpost":
                    receiverId = notificationDAO.getMusicPostWriter(postId);
                    postTitle = notificationDAO.getMusicPostTitle(postId);
                    break;
                default:
                    return;
            }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        // 본인 알림 방지 (필요 시 주석 처리하여 본인 알림 허용 가능)
        if (receiverId == null) {
            return;
        }

        // 제목 길이 자르기
        if (postTitle != null && postTitle.length() > 10) {
            postTitle = postTitle.substring(0, 10) + "...";
        }
        if (postTitle == null) postTitle = "게시글";

        // 2. 보내는 사람 닉네임 조회
        String senderNickname = notificationDAO.getUserNickname(senderId);
        if (senderNickname == null || senderNickname.isEmpty()) {
            senderNickname = senderId; // 닉네임 없으면 ID 사용
        }

        // 3. 메시지 생성
        String title = "Re:Charge 알림";
        String message = "";

        if ("COMMENT".equalsIgnoreCase(type)) {
            message = senderNickname + "님이 [" + postTitle + "]에 댓글을 남겼습니다.";
        } else if ("LIKE".equalsIgnoreCase(type)) {
            message = senderNickname + "님이 [" + postTitle + "]을 좋아합니다.";
        } else if ("FOLLOW".equalsIgnoreCase(type)) {
            // ★ 추가: 팔로우 메시지 ("닉네임님이 회원님을 팔로우합니다.")
            message = senderNickname + "님이 회원님을 팔로우합니다.";
        } else {
            message = senderNickname + "님이 [" + postTitle + "]에 알림을 보냈습니다.";
        }

        // 4. DB 저장
        NotificationVO noti = new NotificationVO();
        noti.setReceiverId(receiverId);
        noti.setSenderId(senderId);
        noti.setNotiType(type);
        noti.setMessage(message);
        noti.setTargetType(targetType);
        noti.setTargetId(targetId);

        notificationDAO.insertNotification(noti);

        // 5. FCM 발송
        try {
            if(fcmService != null) {
                String fcmToken = notificationDAO.getUserFcmToken(receiverId);
                if (fcmToken != null) {
                    fcmService.sendPushNotification(fcmToken, title, message, targetType, targetId);
                }
            }
        } catch (Exception e) {
            System.out.println("FCM 발송 실패: " + e.getMessage());
        }
    }

    // 내 알림 목록 조회
    public List<NotificationVO> getMyNotifications(String userId) {
        return notificationDAO.selectNotificationsByUserId(userId);
    }

    // 알림 읽음 처리
    public void readNotification(Long notiId) {
        notificationDAO.updateNotificationRead(notiId);
    }
}