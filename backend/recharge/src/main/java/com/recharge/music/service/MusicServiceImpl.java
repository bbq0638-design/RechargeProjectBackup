package com.recharge.music.service;

import com.recharge.music.config.MusicConfig;
import com.recharge.music.dao.MusicDAO;
import com.recharge.music.vo.MusicVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MusicServiceImpl implements MusicService{

    private final MusicDAO musicDAO;
    private final MusicConfig musicConfig;
    private final WebClient appleWebClient;
    private final WebClient itunesWebClient;

//    한국 top100 저장
    @Override
    public List<MusicVO> fetchKoreaTop100AndSave() {
        if (!needToUpdate("KR_TOP100")) {
            System.out.println("한국 TOP100 갱신 미필요");
            return List.of();
        }

        List<MusicVO> list = fetchFromRss(musicConfig.getKR_TOP100_URL(), "KR_TOP100");

        // ⭐ 기존 데이터 삭제
        musicDAO.deleteByFlag("KR_TOP100");

        // ⭐ 새 TOP100 저장
        for (MusicVO vo : list) {
            try {
                musicDAO.insertMusic(vo);
            } catch (Exception e) {
                System.out.println("🔥 DB INSERT 오류 (KR_TOP100)");
                System.out.println(" - MUSIC_ID   = " + vo.getMusicId());
                System.out.println(" - TITLE      = " + vo.getMusicTitle());
                System.out.println(" - SINGER     = " + vo.getMusicSinger());
                System.out.println(" - IMAGE_PATH = " + vo.getMusicImagePath());
                e.printStackTrace();   // ❗ 여기서 진짜 ORA 에러가 나올 거예요
            }
        }

        return list;


    }


    @Override
    public List<MusicVO> fetchUSTop100AndSave() {
        if (!needToUpdate("US_TOP100")) {
            System.out.println(" 미국 TOP100 아직 미필요");
            return List.of();
        }

        List<MusicVO> list = fetchFromRss(musicConfig.getUS_TOP100_URL(), "US_TOP100");

        musicDAO.deleteByFlag("US_TOP100");
        for (MusicVO vo : list) {
            try {
                musicDAO.insertMusic(vo);
            } catch (Exception e) {
                System.out.println("🔥 DB INSERT 오류 (US_TOP100)");
                System.out.println(" - MUSIC_ID   = " + vo.getMusicId());
                System.out.println(" - TITLE      = " + vo.getMusicTitle());
                System.out.println(" - SINGER     = " + vo.getMusicSinger());
                System.out.println(" - IMAGE_PATH = " + vo.getMusicImagePath());
                e.printStackTrace();
            }
        }

        return list;
    }



//     * Apple RSS + iTunes Search + UPSERT 공통 로직

    private List<MusicVO> fetchFromRss(String rssUrl, String flag) {

        System.out.println("Apple RSS 호출: " + rssUrl);

        // 1) 상태 코드, 에러 바디까지 로그 찍으면서 응답 받기
        Map<String, Object> response = appleWebClient.get()
                .uri(rssUrl)
                .exchangeToMono(clientResponse -> {
                    System.out.println("Apple RSS status: " + clientResponse.statusCode());

                    // 2xx가 아니면 에러 바디 출력하고 null 리턴
                    if (!clientResponse.statusCode().is2xxSuccessful()) {
                        return clientResponse.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(body -> {
                                    System.out.println("Apple RSS error body: " + body);
                                    return null;
                                });
                    }

                    // 정상일 때만 Map으로 파싱
                    return clientResponse.bodyToMono(Map.class);
                })
                .block();

        // ⭐ 여기가 없어서 NPE가 난 거예요
        if (response == null) {
            System.out.println("⚠ Apple RSS 응답이 null 입니다. 차트 업데이트 중단.");
            return List.of();
        }

        Map<String, Object> feed = (Map<String, Object>) response.get("feed");
        if (feed == null) {
            System.out.println("⚠ Apple RSS 응답에 'feed' 키가 없습니다: " + response);
            return List.of();
        }

        List<Map<String, Object>> results = (List<Map<String, Object>>) feed.get("results");
        if (results == null) {
            System.out.println("⚠ Apple RSS 응답에 'results' 키가 없습니다: " + feed);
            return List.of();
        }

        List<MusicVO> list = new ArrayList<>();

        for (Map<String, Object> item : results) {
            try {
                Long musicId = Long.parseLong((String) item.get("id"));
                String title = (String) item.get("name");
                String singer = (String) item.get("artistName");
                String imageUrl = (String) item.get("artworkUrl100");

                if (title == null || imageUrl == null) {
                    System.out.println("⚠ 제목 또는 이미지가 null 이라서 스킵 → id=" + musicId);
                    continue;
                }


                MusicVO vo = new MusicVO();
                vo.setMusicId(musicId);
                vo.setCommonCategoryId(flag.equals("KR_TOP100") ? "MUSIC1" : "MUSIC2");
                vo.setMusicTitle(title);
                vo.setMusicSinger(singer);
                vo.setMusicImagePath(imageUrl);
                vo.setMusicFlag(flag);

                list.add(vo);

            } catch (Exception e) {
                System.out.println(" 음악 VO 생성 오류: " + e.getMessage());
            }
        }

        return list;
    }

    /** 7일 체크 로직 */
    public boolean needToUpdate(String flag) {
        String latest = flag.equals("KR_TOP100")
                ? musicDAO.getLatestKrUpdateDate()
                : musicDAO.getLatestUsUpdateDate();

        if (latest == null) return true;

        LocalDate last = LocalDate.parse(latest);
        LocalDate now = LocalDate.now();

        return last.plusDays(7).isBefore(now) || last.plusDays(7).isEqual(now);
    }


    /** =======================================
     *  기본 조회 기능들
     * ======================================= */
    @Override
    public MusicVO getMusic(Long musicId) {
        return musicDAO.selectMusicById(musicId);
    }

    @Override
    public List<MusicVO> getAllMusic() {
        return musicDAO.selectAllMusic();
    }

    @Override
    public List<MusicVO> getMusicByFlag(String musicFlag) {
        return musicDAO.selectMusicByFlag(musicFlag);
    }
}



