package com.recharge.music.controller;

import com.recharge.music.service.MusicPostService;
import com.recharge.music.vo.MusicListVO;
import com.recharge.music.vo.MusicPostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/musicpost")
public class MusicPostController {

    private final MusicPostService musicPostService;

//    게시글 + 재생목록 등록
    @PostMapping
    public Long createMusicPost(@RequestBody Map<String, Object> payload) {
//        게시글 데이터 매핑
        MusicPostVO post = new MusicPostVO();
        post.setUserId((String) payload.get("userId"));
        post.setMusicPostTitle((String) payload.get("musicPostTitle"));
        post.setMusicPostText((String) payload.get("musicPostText"));

        post.setCreateId(post.getUserId());
        post.setUpdatedId(post.getUserId());

//      플레이리스트 파싱
        List<Map<String, Object>> list =
                (List<Map<String, Object>>) payload.get("playlist");

        List<MusicListVO> playlist = new ArrayList<>();

        if (list != null) {
            for (Map<String, Object> item : list) {

                MusicListVO vo = new MusicListVO();
                Object trackIdObj = item.get("musicId");
                if (trackIdObj != null) {
                    vo.setMusicId(Long.valueOf(trackIdObj.toString()));
                } else {
                    vo.setMusicId(null); // iTunes 검색결과엔 trackId 항상 있음 → fallback
                }
                vo.setMusicTitle((String) item.get("musicTitle"));
                vo.setMusicSinger((String) item.get("musicSinger"));
                vo.setMusicImagePath((String) item.get("musicImagePath"));
                vo.setMusicPreviewUrl((String) item.get("musicPreviewUrl"));

                playlist.add(vo);
            }
        }

        return musicPostService.createMusicPost(post, playlist);
    }

    //게시글 조회
    @GetMapping("/{postId}")
    public MusicPostVO getFullDetail(@PathVariable Long postId) {
        return musicPostService.getFullPostDetail(postId);
    }

    /**  게시글 전체 조회 */
    @GetMapping
    public List<MusicPostVO> getAllPosts() {
        return musicPostService.getAllPosts();
    }


//    플레이리스트 게시글 저장용 음악 검색
    @GetMapping("/search")
    public List<MusicListVO> searchMusic(@RequestParam String query) {
        return musicPostService.searchMusic(query);
    }

//    이용자의 다른 게시글
    @GetMapping("/user/{userId}")
    public List<MusicPostVO> getPostsByUser(@PathVariable String userId) {
        return musicPostService.getPostsByUser(userId);
    }

    /** 게시글 수정 */
    @PutMapping("/{postId}")
    public Long updateMusicPost(
            @PathVariable Long postId,
            @RequestBody Map<String, Object> payload
    ) {

        MusicPostVO post = new MusicPostVO();
        post.setMusicPostId(postId);
        post.setMusicPostTitle((String) payload.get("musicPostTitle"));
        post.setMusicPostText((String) payload.get("musicPostText"));
        post.setUpdatedId((String) payload.get("updatedId"));

        // playlist 파싱
        List<Map<String, Object>> list = (List<Map<String, Object>>) payload.get("playlist");
        List<MusicListVO> playlist = new ArrayList<>();

        if (list != null) {
            for (Map<String, Object> item : list) {
                MusicListVO vo = new MusicListVO();

                Object trackIdObj = item.get("musicId");
                if (trackIdObj instanceof Number num) {
                    vo.setMusicId(num.longValue());
                }

                vo.setMusicTitle((String) item.get("musicTitle"));
                vo.setMusicSinger((String) item.get("musicSinger"));
                vo.setMusicImagePath((String) item.get("musicImagePath"));
                vo.setMusicPreviewUrl((String) item.get("musicPreviewUrl"));
                playlist.add(vo);
            }
        }

        return musicPostService.updateMusicPost(post, playlist);
    }

    /** 게시글 삭제 */
    @DeleteMapping("/{postId}")
    public boolean deleteMusicPost(@PathVariable Long postId) {
        return musicPostService.deleteMusicPost(postId);
    }





}


