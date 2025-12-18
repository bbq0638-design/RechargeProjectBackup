package com.recharge.user.controller;

import com.recharge.config.JwtTokenProvider;
import com.recharge.user.dao.UserDAO;
import com.recharge.user.service.UserService;
import com.recharge.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    //아이디 중복체크
    @GetMapping("/check-id")
    public ResponseEntity<Boolean> checkUserId(@RequestParam String userId) {
        boolean exists = userService.checkUserId(userId);
        return ResponseEntity.ok(exists);
    }

    //닉네임 중복체크
    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkUserNickname(@RequestParam String userNickname) {
        boolean exists = userService.checkUserNickname(userNickname);
        return ResponseEntity.ok(exists);
    }

    //회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signup (@RequestBody UserVO user) {

        if(userService.checkUserId(user.getUserId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용중인 아이디입니다.");
        }

        if(userService.checkUserNickname(user.getUserNickname())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용중인 닉네임입니다.");
        }

        int result = userService.insertUser(user);
        if (result > 0) {
            return ResponseEntity.ok("회원가입 성공");
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody UserVO user) {
        try {
            UserVO result = userService.login(user);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/find-id")
    public ResponseEntity<?> findUserId(@RequestBody UserVO user) {

        boolean result = userService.sendUserIdToEmail(user);

        if (!result) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("일치하는 정보가 없습니다.");
        }

        return ResponseEntity.ok("이메일로 아이디를 발송했습니다.");
    }

    @PostMapping("/find-password")
    public ResponseEntity<?> requestPasswordReset(@RequestBody UserVO user) {
        boolean result = userService.requestPasswordReset(user);

        if(!result) {
            return ResponseEntity.status(404)
                    .body("일치하는 회원 정보가 없습니다.");
        }

        return ResponseEntity.ok("비밀번호 재설정 링크를 이메일로 발송했습니다.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody UserVO user) {

        // 🔥 토큰으로 사용자 조회
        UserVO dbUser = userService.getUserByResetToken(user.getResetToken());
        if(dbUser == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("유효하지 않거나 만료된 링크입니다.");
        }

        // 해당 사용자 비밀번호 변경 로직 수행
        user.setUserId(dbUser.getUserId()); // DB에 있는 실제 userId 설정

        boolean result = userService.resetPassword(user);

        if(!result) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("비밀번호 변경 실패");
        }

        return ResponseEntity.ok("비밀번호 변경 성공");
    }

    @PostMapping("/send-email-auth")
    public ResponseEntity<?> sendEmailAuth(@RequestBody UserVO user) {
        boolean result = userService.sendEmailAuthentication(user);

        if(!result) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이메일 인증 메일 발송 실패 (중복된 이메일 또는 오류)");
        }

        return ResponseEntity.ok("인증 메일을 전송했습니다. 메일을 확인해주세요!");
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody UserVO user) {
        boolean result = userService.verifyEmail(user);

        if(!result) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않거나 만료된 인증 코드입니다.");
        }

        return ResponseEntity.ok("이메일 인증이 완료 되었습니다.");
    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestParam String userId) {
        UserVO result = userService.getUserById(userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/modify")
    public  ResponseEntity<?> modifyUser(@RequestBody UserVO user) {
        boolean result =userService.updateUserInfo(user);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/profile-pw")
    public ResponseEntity<?> profilePw(@RequestBody UserVO user, Authentication authentication) {
        // authentication에서 현재 로그인한 유저의 아이디를 꺼내옵니다.
        String currentUserId = authentication.getName();

        // 전달받은 user 객체에 아이디를 강제로 셋팅합니다.
        user.setUserId(currentUserId);
        user.setUpdatedId(currentUserId); // 수정자 아이디도 함께 셋팅

        boolean result = userService.updateProfilePW(user);
        return ResponseEntity.ok(result);
    }

    //탈퇴
    @DeleteMapping("/delete-user")
    public ResponseEntity<?>deleteUser(@RequestParam String userId) {
        boolean result = userService.deleteUser(userId);
        return ResponseEntity.ok(result);
    }
    
    
// ==========================================
// ★ [추가] FCM 토큰 저장 (프론트 api.js에서 호출)
// ==========================================
@PostMapping("/fcm-token")
public ResponseEntity<?> updateFcmToken(@RequestBody Map<String, String> payload) {
    String userId = payload.get("userId");
    String token = payload.get("token");

    System.out.println("FCM 토큰 업데이트 요청: " + userId);

    userService.updateFcmToken(userId, token);

    return ResponseEntity.ok("FCM Token Updated");
    }
    // [카카오 로그인]
    @PostMapping("/kakao-login")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> payload) {
        String accessToken = payload.get("accessToken");

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.badRequest().body("카카오 토큰이 없습니다.");
        }

        try {
            // 서비스 호출
            UserVO user = userService.processKakaoLogin(accessToken);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("로그인 실패: " + e.getMessage());
        }
    }
}