package com.recharge.music.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recharge.music.dao.MusicPostDAO;
import com.recharge.music.vo.MusicListVO;
import com.recharge.music.vo.MusicPostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MusicPostServiceImpl implements MusicPostService {

    private final MusicPostDAO musicPostDAO;
    private final WebClient itunesWebClient;
    private final ObjectMapper objectMapper;

    /** 게시글 + playlist 등록 */
    @Override
    @Transactional
    public Long createMusicPost(MusicPostVO post, List<MusicListVO> playlist) {

        musicPostDAO.insertMusicPost(post);
        Long postId = post.getMusicPostId();

        if (playlist != null) {
            for (MusicListVO track : playlist) {
                track.setMusicPostId(postId);
                track.setCreateId(post.getCreateId());
                track.setUpdatedId(post.getUpdatedId());
                musicPostDAO.insertMusicList(track);
            }
        }

        return postId;
    }

    /** 전체 게시글 조회 */
    @Override
    public List<MusicPostVO> getAllPosts() {
        return musicPostDAO.selectAllPosts();
    }

    /** iTunes 음악 검색 */
    @Override
    public List<MusicListVO> searchMusic(String query) {
        try {
            String json = itunesWebClient.get()
                    .uri(uri -> uri.path("/search")
                            .queryParam("term", query)
                            .queryParam("media", "music")
                            .queryParam("limit", 10)
                            .queryParam("country", "KR")
                            .queryParam("lang", "ko_kr")
                            .build()
                    )
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            Map<String, Object> response = objectMapper.readValue(json, Map.class);
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");

            return results.stream()
                    .filter(item -> "track".equals(item.get("wrapperType")))
                    .map(item -> {
                        MusicListVO vo = new MusicListVO();

                        Object trackIdObj = item.get("trackId");
                        if (trackIdObj instanceof Number num) vo.setMusicId(num.longValue());

                        vo.setMusicTitle((String) item.get("trackName"));
                        vo.setMusicSinger((String) item.get("artistName"));
                        vo.setMusicImagePath((String) item.get("artworkUrl100"));
                        vo.setMusicPreviewUrl((String) item.get("previewUrl"));

                        return vo;
                    })
                    .toList();

        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    /** 동일 작성자의 다른 게시글 조회 */
    @Override
    public List<MusicPostVO> getPostsByUser(String userId) {
        return musicPostDAO.selectPostsByUser(userId);
    }

    /** 게시글 수정 */
    @Override
    @Transactional
    public Long updateMusicPost(MusicPostVO post, List<MusicListVO> playlist) {

        Long postId = post.getMusicPostId();

        /* 1) 게시글 자체 수정 */
        musicPostDAO.updateMusicPost(post);


        /* 2) 기존 리스트의 musicId 목록 조회 */
        List<Long> existingMusicIds = musicPostDAO.selectMusicIdsByPost(postId);
        // ↑ 이 mapper는 새로 만들어야 함 (아래에 예시 제공)


        /* 3) 프론트에서 넘어온 playlist의 musicId 목록 */
        List<Long> incomingMusicIds = playlist.stream()
                .map(MusicListVO::getMusicId)
                .toList();


        /* 4) 삭제해야 할 musicId 찾기 */
        List<Long> toDelete = existingMusicIds.stream()
                .filter(id -> !incomingMusicIds.contains(id))
                .toList();

        if (!toDelete.isEmpty()) {
            musicPostDAO.deleteMusicListByMusicIds(postId, toDelete);
        }


        /* 5) UPDATE 또는 INSERT 처리 */
        for (MusicListVO track : playlist) {

            track.setMusicPostId(postId);             // 게시글 번호 설정
            track.setUpdatedId(post.getUpdatedId());  // 수정자 반영

            System.out.println("=== TRACK DEBUG ===");
            System.out.println("musicId: " + track.getMusicId());
            System.out.println("musicTitle: " + track.getMusicTitle());
            System.out.println("musicSinger: " + track.getMusicSinger());
            System.out.println("image: " + track.getMusicImagePath());
            System.out.println("preview: " + track.getMusicPreviewUrl());
            System.out.println("createId: " + track.getCreateId());
            System.out.println("updatedId: " + track.getUpdatedId());

            if (existingMusicIds.contains(track.getMusicId())) {
                /* 기존 곡 → UPDATE */
                musicPostDAO.updateMusicList(track);
            } else {
                /* 새로운 곡 → INSERT */
                track.setCreateId(post.getUpdatedId());
                musicPostDAO.insertMusicList(track);
            }
        }


        return postId;
    }

    /** 삭제 */
    @Override
    @Transactional
    public boolean deleteMusicPost(Long postId) {

        musicPostDAO.deleteMusicListByPost(postId);

        int result = musicPostDAO.deleteMusicPost(postId);

        return result > 0;
    }

    /** FULL DETAIL (게시글 + playlist) */
    @Override
    public MusicPostVO getFullPostDetail(Long postId) {

        MusicPostVO post = musicPostDAO.selectMusicPostDetail(postId);
        if (post == null) return null;

        List<MusicListVO> playlist = musicPostDAO.selectMusicListByPost(postId);

        post.setPlaylist(playlist);

        return post;
    }

}
