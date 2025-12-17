package com.recharge.movie.controller;

import com.recharge.movie.service.MoviePostService;
import com.recharge.movie.vo.MoviePostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moviepost")
@RequiredArgsConstructor
public class MoviePostController {

    private final MoviePostService moviePostService;

    @PostMapping
    public ResponseEntity<Long> createPost(@RequestBody MoviePostVO vo) {
        Long postId = moviePostService.createPost(vo);

        return ResponseEntity.ok(postId);
    }

    @GetMapping
    public ResponseEntity<?> getList() {
        return ResponseEntity.ok(moviePostService.getPostList());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(moviePostService.getPostById(postId));
    }

    @GetMapping("/user/{userId}")
    public List<MoviePostVO> getUserPosts(@PathVariable String userId) {
        return moviePostService.getUserMoviePosts(userId);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,
            @RequestBody MoviePostVO vo

    ) {
        vo.setMoviePostId(postId);
        if (vo.getUpdatedId() == null) {
            vo.setUpdatedId(vo.getUserId()); // 또는 로그인 사용자 ID
        }

        moviePostService.updatePost(vo);
        return ResponseEntity.ok("UPDATED");


    }


    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        moviePostService.deletePost(postId);
        return ResponseEntity.ok("DELETED");
    }


}
