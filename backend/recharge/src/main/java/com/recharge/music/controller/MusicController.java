package com.recharge.music.controller;


import com.recharge.music.service.MusicService;
import com.recharge.music.vo.MusicVO;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/music")
@RequiredArgsConstructor
public class MusicController {

    private final MusicService musicService;

//    한국 top100 강제 갱신
    @PostMapping("/sync/korea")
    public List<MusicVO> syncKoreaTop100() {
        return musicService.fetchKoreaTop100AndSave();
    }

//    팝송 top100 강제 갱신
    @PostMapping("/sync/us")
    public List<MusicVO> syncUSTop100() {
        return musicService.fetchUSTop100AndSave();
    }
    /** FLAG 기반 조회 (KR_TOP100 / US_TOP100 / USER_RECOMMEND 등) */
    @GetMapping("/flag/{flag}")
    public List<MusicVO> getMusicByFlag(@PathVariable String flag) {
        return musicService.getMusicByFlag(flag);
    }

    /** 단일 음악 조회 */
    @GetMapping("/{musicId}")
    public MusicVO getMusic(@PathVariable Long musicId) {
        return musicService.getMusic(musicId);
    }

    /** 전체 음악 조회 */
    @GetMapping
    public List<MusicVO> getAllMusic() {
        return musicService.getAllMusic();
    }

}
