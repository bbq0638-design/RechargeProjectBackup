package com.recharge.music.service;

import com.recharge.music.vo.MusicListVO;
import com.recharge.music.vo.MusicPostVO;

import java.util.List;

public interface MusicPostService {

    Long createMusicPost(MusicPostVO post, List<MusicListVO> playlist);

    List<MusicPostVO> getAllPosts();

    List<MusicListVO> searchMusic(String query);

    List<MusicPostVO> getPostsByUser(String userId);

    Long updateMusicPost(MusicPostVO post, List<MusicListVO> playlist);

    boolean deleteMusicPost(Long postId);

    MusicPostVO getFullPostDetail(Long postId);




}
