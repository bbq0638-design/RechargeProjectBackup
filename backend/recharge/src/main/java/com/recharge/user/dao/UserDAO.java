package com.recharge.user.dao;

import com.recharge.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface UserDAO {
    int insertUser(UserVO user);

    int checkUserId(String userId);

    int checkUserNickName(String userNickname);

    UserVO getUserById(String userId);

    int updateDeviceInfo(UserVO user);

    String findUserId(UserVO user);

    UserVO findUserForPasswordReset(UserVO user);

    int updateResetToken (UserVO user);

    UserVO getUserByResetToken (String resetToken);

    int updateUserPassword (UserVO user);

    int checkUserEmail(String userEmail);

    int updateEmailAuthCode(UserVO user);

    UserVO getUserByEmailAuthCode(UserVO user);

    int verifyUserEmail(UserVO user);

    int updateUserAfterEmailVerified(UserVO user);

    int updateUserInfo(UserVO user);

    int updateProfileUserPassword(UserVO user);

    // ★ 추가
    void updateFcmToken(Map<String, String> params);

    int deleteUser(String userId);

    // [소셜 로그인] 소셜 ID로 회원 조회
    UserVO findBySocialId(String socialId);

    // [소셜 로그인] 소셜 전용 회원가입 (비번 없이)
    int insertSocialUser(UserVO user);
}