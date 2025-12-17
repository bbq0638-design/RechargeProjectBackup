package com.recharge.user.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.MultiValueMap;

import com.recharge.config.JwtTokenProvider;
import com.recharge.user.dao.UserDAO;
import com.recharge.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;

    /**
     * 회원가입
     */
    @Override
    public int insertUser(UserVO user) {

        if (!"Y".equals(user.getEmailVerified())) {
            throw new RuntimeException("이메일 인증을 완료해주세요.");
        }

        // 아이디 & 닉네임 중복 체크
        if (userDAO.checkUserId(user.getUserId()) > 0) {
            return -1;
        }
        if (userDAO.checkUserNickName(user.getUserNickname()) > 0) {
            return -2;
        }

        user.setUserPwd(passwordEncoder.encode(user.getUserPwd()));
        user.setUserRole("USER");
        user.setUpdatedId(user.getUserId());

        // ⭐ 이미 이메일로 임시 가입된 유저 → UPDATE로 최종 정보 저장
        return userDAO.updateUserAfterEmailVerified(user);
    }

    @Override
    public boolean checkUserId(String userId) {
        return userDAO.checkUserId(userId) > 0;
    }

    @Override
    public boolean checkUserNickname(String userNickname) {
        return userDAO.checkUserNickName(userNickname) > 0;
    }

    /**
     * 로그인
     */
    @Override
    public UserVO login(UserVO user) {
        UserVO dbUser = userDAO.getUserById(user.getUserId());

        if (dbUser == null) {
            throw new RuntimeException("존재하지 않는 아이디입니다.");
        }

        if (!passwordEncoder.matches(user.getUserPwd(), dbUser.getUserPwd())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        dbUser.setDeviceOs((user.getDeviceOs()));
        dbUser.setDeviceVersion(user.getDeviceVersion());
        dbUser.setFcmToken(user.getFcmToken());
        dbUser.setUpdatedId(dbUser.getUserId());

        userDAO.updateDeviceInfo(dbUser);

        String token = jwtTokenProvider.createToken(dbUser.getUserId(), dbUser.getUserRole());
        dbUser.setToken(token);

        dbUser.setUserPwd(null);

        return dbUser;
    }

    @Override
    public boolean sendUserIdToEmail(UserVO user) {

        String userId = userDAO.findUserId(user);

        if (userId == null) {
            System.out.println("일치하는 계정 없음");
            return false;
        }

        String subject = "[Re:charge] 아이디 찾기 안내";
        String content = "안녕하세요.\n\n회원님의 아이디는 '" + userId + "' 입니다.\n\nRe:charge를 이용해 주셔서 감사합니다.";

        return emailService.sendEmail(user.getUserEmail(), subject, content);
    }

    @Override
    public boolean requestPasswordReset(UserVO user) {

        UserVO foundUser = userDAO.findUserForPasswordReset(user);
        if (foundUser == null) return false;

        String resetToken = java.util.UUID.randomUUID().toString();

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, 30);
        java.util.Date expireDate = calendar.getTime();

        user.setResetToken(resetToken);
        user.setTokenExpire(expireDate);

        userDAO.updateResetToken(user);

        String resetUrl = "rechargeapp://reset-password?token=" + resetToken;
        String subject = "[Re:charge] 비밀번호 재설정 안내";
        String content =
                "<p>안녕하세요.</p>" +
                        "<p>비밀번호를 재설정하려면 아래 링크를 클릭해주세요.</p>" +
                        "<p><a href=\"" + resetUrl + "\">비밀번호 재설정하기</a></p>" +
                        "<p>본 메일은 30분간만 유효합니다.</p>";

        return emailService.sendEmail(user.getUserEmail(), subject, content);
    }

    @Override
    public UserVO getUserByResetToken(String resetToken) {
        return userDAO.getUserByResetToken(resetToken);
    }

    @Override
    public boolean resetPassword(UserVO user) {

        user.setUserPwd(passwordEncoder.encode(user.getUserPwd()));

        return userDAO.updateUserPassword(user) > 0;
    }

    @Override
    public boolean checkUserEmail(String userEmail) {
        return userDAO.checkUserEmail(userEmail) > 0;
    }

    /**
     * 이메일 인증 코드 발송
     */
    @Override
    public boolean sendEmailAuthentication(UserVO user) {

        if (userDAO.checkUserEmail(user.getUserEmail()) > 0) {
            return false;
        }

        String authCode = java.util.UUID.randomUUID().toString().substring(0, 6);

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, 10);
        java.util.Date expireDate = calendar.getTime();

        user.setEmailAuthCode(authCode);
        user.setEmailAuthExpire(expireDate);

        // ✔ 결과가 0이어도 MERGE insert 되었음 → 성공으로 간주
        userDAO.updateEmailAuthCode(user);

        String subject = "[Re:charge] 이메일 인증 안내";
        String content =
                "<p>안녕하세요! Re:charge 입니다.</p>" +
                        "<p>아래 인증 버튼을 눌러주세요.</p>" +
                        "<p><a href=\"rechargeapp://email-auth?code=" + authCode +
                        "&email=" + user.getUserEmail() + "\">📩 이메일 인증하기</a></p>" +
                        "<p>(유효시간: 10분)</p>";
        return emailService.sendEmail(user.getUserEmail(), subject, content);
    }

    @Override
    public boolean verifyEmail(UserVO user) {
        UserVO dbUser = userDAO.getUserByEmailAuthCode(user);

        if (dbUser == null) return false;

        dbUser.setUserEmail(user.getUserEmail());

        return userDAO.verifyUserEmail(dbUser) > 0;
    }

    //회원정보 조회
    @Override
    public UserVO getUserById(String userId) {
        return userDAO.getUserById(userId);
    }

    //회원정보 수정
    @Override
    public boolean updateUserInfo(UserVO user) {
        if (user.getUserNickname() != null) {
            UserVO dbUser = userDAO.getUserById(user.getUserId());

            if (!dbUser.getUserNickname().equals(user.getUserNickname())) {
                if (userDAO.checkUserNickName(user.getUserNickname()) > 0) {
                    throw new RuntimeException("이미 사용 중인 닉네임입니다.");
                }
            }
        }
        return userDAO.updateUserInfo(user) > 0;
    }

    @Override
    public boolean updateProfilePW(UserVO user) {

        user.setUserPwd(passwordEncoder.encode(user.getUserPwd()));

        return userDAO.updateProfileUserPassword(user) > 0;
    }

    @Override
    public void updateFcmToken(String userId, String token) {
        Map<String, String> params = new HashMap<>();
        params.put("userId", userId);
        params.put("token", token);

        userDAO.updateFcmToken(params);
    }

    @Override
    public boolean deleteUser(String userId) {
        return userDAO.deleteUser(userId) > 0;
    }


    @Override
    public UserVO processKakaoLogin(String kakaoAccessToken) {
        try {
            UserVO kakaoUserInfo = getKakaoUserInfo(kakaoAccessToken);
            UserVO user = userDAO.findBySocialId(kakaoUserInfo.getSocialId());

            if (user == null) {
                user = kakaoUserInfo;
                user.setUserId("kakao_" + kakaoUserInfo.getSocialId());
                user.setUserRole("USER");
                userDAO.insertSocialUser(user);
            }

            String jwtToken = jwtTokenProvider.createToken(user.getUserId(), user.getUserRole());
            user.setToken(jwtToken);
            return user;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("카카오 로그인 처리 중 오류 발생: " + e.getMessage());
        }
    }

    private UserVO getKakaoUserInfo(String accessToken) throws Exception {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoProfileRequest,
                String.class
        );

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(response.getBody());

        long id = jsonNode.get("id").asLong();
        String nickname = jsonNode.path("properties").path("nickname").asText();
        String email = jsonNode.path("kakao_account").path("email").asText();
        String name = jsonNode.path("kakao_account").path("name").asText();

        // 🔥 [수정] 닉네임 랜덤 생성 로직 (충전중_5자리숫자)
        if (nickname == null || nickname.isEmpty() || nickname.equals("null")) {
            int randomNum = new Random().nextInt(90000) + 10000;
            nickname = "K_" + randomNum;
        }

        // 이름 데이터 방어 로직
        if (name == null || name.isEmpty() || name.equals("null")) {
            name = nickname;
        }

        // 이메일 데이터 방어 로직
        if (email == null || email.isEmpty() || email.equals("null")) {
            email = "kakao_" + id + "@no-email.com";
        }

        UserVO userInfo = new UserVO();
        userInfo.setSocialId(String.valueOf(id));
        userInfo.setUserNickname(nickname);
        userInfo.setUserName(name);
        userInfo.setUserEmail(email);
        userInfo.setSocialType("KAKAO");

        return userInfo;
    }
}