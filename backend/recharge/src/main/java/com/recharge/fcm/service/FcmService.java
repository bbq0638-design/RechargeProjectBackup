package com.recharge.fcm.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Service
public class FcmService {

    // 서버 시작 시 파이어베이스 연결 설정
    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                // resources 폴더 안에 있는 서비스 키 파일 (파이어베이스 콘솔에서 다운로드)
                ClassPathResource resource = new ClassPathResource("serviceAccountKey.json");

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("✅ Firebase Application Initialized");
            }
        } catch (IOException e) {
            System.err.println("❌ Firebase Init Failed: " + e.getMessage());
        }
    }

    // 푸시 알림 전송 메서드
    public void sendPushNotification(String token, String title, String body, String targetType, String targetId) {
        if (token == null || token.isEmpty()) {
            System.out.println("❌ FCM 전송 실패: 토큰 없음");
            return;
        }

        try {
            // 알림 메시지 구성
            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    // 앱에서 화면 이동을 위해 필요한 데이터 (data payload)
                    .putData("targetType", targetType)
                    .putData("targetId", targetId)
                    .build();

            // 전송
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("✅ FCM 전송 성공: " + response);

        } catch (Exception e) {
            System.err.println("❌ FCM 전송 에러: " + e.getMessage());
        }
    }
}