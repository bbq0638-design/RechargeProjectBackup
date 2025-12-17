package com.recharge.music.dao;

import com.recharge.music.vo.MusicListVO;
import com.recharge.music.vo.MusicPostVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MusicPostDAO {

    /* INSERT */
    void insertMusicPost(MusicPostVO post);
    void insertMusicList(MusicListVO music);

    /* SELECT */
    List<MusicPostVO> selectAllPosts();
    MusicPostVO selectMusicPostDetail(Long musicPostId);
    List<MusicListVO> selectMusicListByPost(Long musicPostId);
    List<MusicPostVO> selectPostsByUser(@Param("userId") String userId);

    /* UPDATE */
    void updateMusicPost(MusicPostVO post);
    void updateMusicList(MusicListVO music);

    /* DELETE */
    int deleteMusicPost(Long postId);
    void deleteMusicListByPost(Long postId);

    /* 수정용 - MUSIC_ID 기준 비교 */
    List<Long> selectMusicIdsByPost(Long postId);

    void deleteMusicListByMusicIds(@Param("postId") Long postId,
                                   @Param("musicIds") List<Long> musicIds);
    ;

}