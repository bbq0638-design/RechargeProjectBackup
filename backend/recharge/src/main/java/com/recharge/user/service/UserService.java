package com.recharge.user.service;

import com.recharge.user.vo.UserVO;

public interface UserService {
    int insertUser(UserVO user);
    boolean checkUserId(String userId);
    boolean checkUserNickname(String userNickname);
    boolean checkUserEmail(String userEmail);
    UserVO login(UserVO user);
    boolean sendUserIdToEmail(UserVO user);
    boolean requestPasswordReset(UserVO user);
    UserVO getUserByResetToken(String resetToken);
    boolean resetPassword(UserVO user);
    boolean sendEmailAuthentication(UserVO user);
    boolean verifyEmail(UserVO user);

    boolean updateUserInfo(UserVO user);
    UserVO getUserById(String userId);

    boolean updateProfilePW(UserVO user);
    // ★ 추가
    void updateFcmToken(String userId, String token);

    boolean deleteUser(String userId);

    // [카카오 로그인 처리]
    UserVO processKakaoLogin(String accessToken);
}
