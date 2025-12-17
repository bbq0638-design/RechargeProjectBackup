package com.recharge.user.vo;

import lombok.Data;

import java.util.Date;

@Data
public class UserVO {
    private String userId;
    private String userPwd;
    private String userEmail;
    private String userName;
    private String userNickname;
    private String userBirth;
    private String userGender;
    private String userPhone;
    private String userCarModel;
    private String userRole;
    private String deviceOs;
    private String deviceVersion;
    private String fcmToken;

    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;

    private String token; //JWT 토큰

    private String resetToken;  // 비밀번호 리셋 토큰
    private Date tokenExpire;   // 비밀번호 리셋 유효시간

    // 🔥 이메일 인증 관련
    private String emailVerified;    // 'Y' = 인증됨 / 'N' = 미인증
    private String emailAuthCode;    // 이메일 인증 토큰
    private Date emailAuthExpire;    // 인증 유효시간

    // [소셜 로그인 추가 필드]
    private String socialType; // KAKAO, NAVER, GOOGLE, NONE
    private String socialId;   // 소셜 식별 ID (카카오 회원번호)
}
