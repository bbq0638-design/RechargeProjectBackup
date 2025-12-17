package com.recharge.community.controller;

import com.recharge.community.service.CommunityService;
import com.recharge.community.vo.CommunityVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    //카테고리 목록 조회 API
    @GetMapping("/categories")
    public ResponseEntity<List<CommunityVO>> getCategoryList() {
        System.out.println("카테고리 목록 호출됨");

        List<CommunityVO> list = communityService.selectCategoryList();

        System.out.println("조회된 카테고리수:" + (list != null ? list.size() : 0));

        return ResponseEntity.ok(list);
    }

    //글 작성
    @PostMapping("/post")
    public ResponseEntity<?> createPost(
            @ModelAttribute CommunityVO communityVO,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        System.out.println("글쓰기 요청 데이터: " + communityVO);

        try {
            //필수값 체크(제목, 내용, 카테고리)
            if (communityVO.getCommunityTitle() == null || communityVO.getCategoryCode() == null) {
                return ResponseEntity.badRequest().body("제목과 카테고리는 필수입니다.");
            }
            if (file != null && !file.isEmpty()) {
                communityVO.setCommunityImageData(file.getBytes());
            }
            communityService.insertPost(communityVO);
            return ResponseEntity.ok(Map.of("message", "글 동록 성공", "status", "OK"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("글 등록 중 오류 발생: " + e.getMessage());
        }
    }

    //이미지 불러오기
    @

            GetMapping("/image/{postId}")
    public ResponseEntity<byte[]> getImage(@PathVariable int postId) {
        //DB에서 이미지 데이터 가져오기
        byte[] imageData = communityService.getCommunityImage(postId);

        //이미지 없으면 404
        if (imageData == null || imageData.length == 0) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        //헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);

        //데이터 발사
        return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
    }


    //게시글 목록 조회
    @GetMapping("/posts")
    public ResponseEntity<List<CommunityVO>> getPostList() {
        System.out.println("게시글 목록 요청 들어옴");
        List<CommunityVO> list = communityService.selectPostList();
        System.out.println("조회된 글 개수: " + (list != null ? list.size() : 0));
        return ResponseEntity.ok(list);
    }

    //게시글 상세 조회(조회수)
    @GetMapping("/post/{postId}")
    public ResponseEntity<CommunityVO> getPostDetail(
                @PathVariable("postId") int postId,
                @RequestParam(value="userId", required = false) String userId
    ) {
        System.out.println("상세 조회 요청: ID=" + postId+", UserId=" + userId);

        CommunityVO post = communityService.readPost(postId, userId);

        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //게시글 삭제
    @DeleteMapping("/post/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable("postId") int postId) {
        System.out.println("게시글 삭제 요청: ID=" + postId);
        try {
            communityService.deletePost(postId);
            return ResponseEntity.ok(Map.of("message", "삭제 성공", "status", "OK"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("삭제 실패");
        }
    }

    //게시글 수정
    @PutMapping("/post/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable int postId,
            @ModelAttribute CommunityVO communityVO,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        System.out.println("글 수정 요청 ID: " + postId);

        try {
            communityVO.setCommunityPostId(postId);

            if (file != null && !file.isEmpty()) {
                communityVO.setCommunityImageData(file.getBytes());
            }
            communityService.updatePost(communityVO);
            return ResponseEntity.ok(Map.of("message", "수정 성공", "status", "OK"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("수정 실패");
        }
    }

    //좋아요 토글
    @PostMapping("/post/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable int id, @RequestBody Map<String, String> body) {
        String userId = body.get("userId");

        try {
            boolean isLiked = communityService.toggleLike(id, userId);

            int newCount = communityService.getLikeCount(id);

            return ResponseEntity.ok(Map.of(
                    "liked", isLiked,
                    "count", newCount
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("좋아요 처리 실패");
        }
    }
}

