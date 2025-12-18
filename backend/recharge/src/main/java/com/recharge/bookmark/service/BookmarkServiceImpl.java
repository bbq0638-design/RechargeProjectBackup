package com.recharge.bookmark.service;

import com.recharge.bookmark.dao.BookmarkDAO;
import com.recharge.bookmark.vo.BookmarkVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkDAO bookmarkDAO;
    private final WebClient tmdbWebClient;

    /** ⭐ 토글 */
    @Override
    @Transactional
    public boolean toggleBookmark(BookmarkVO vo) {
        int exists = bookmarkDAO.existsBookmark(vo);

        if (exists > 0) {
            bookmarkDAO.deleteBookmark(vo);
            return false;
        }

        // 🤖 AI 음악 전용 분기 (merge)
        if ("music_ai".equals(vo.getBookmarkTargetType())) {
            bookmarkDAO.insertAiMusicBookmark(vo);
        } else {
            bookmarkDAO.insertBookmark(vo);
        }

        return true;
    }

    /** ⭐ 단건 체크 */
    @Override
    public boolean checkBookmark(String userId, String targetType, Long targetId) {
        BookmarkVO vo = new BookmarkVO();
        vo.setUserId(userId);
        vo.setBookmarkTargetType(targetType);
        vo.setBookmarkTargetId(targetId);

        return bookmarkDAO.existsBookmark(vo) > 0;
    }

    /** ⭐ 리스트 상태 맵 */
    @Override
    public Map<Long, Boolean> getBookmarkStatusMap(
            String userId,
            String targetType,
            List<Long> targetIds
    ) {
        List<Long> bookmarkedIds =
                bookmarkDAO.selectBookmarkedTargetIds(userId, targetType, targetIds);

        Map<Long, Boolean> result = new HashMap<>();
        for (Long id : targetIds) {
            result.put(id, bookmarkedIds.contains(id));
        }
        return result;
    }

    /** ⭐ 유저 전체 북마크 */
    @Override
    public List<BookmarkVO> getUserBookmarks(String userId) {

        List<BookmarkVO> bookmarks = bookmarkDAO.selectUserBookmarks(userId);

        for (BookmarkVO bm : bookmarks) {

            // 🎬 movie 타입이고, JOIN 결과가 비어있을 때만 (기존 유지)
            if ("movie".equals(bm.getBookmarkTargetType())
                    && (bm.getTitle() == null || bm.getImage() == null)) {

                try {
                    Map<String, Object> detail = tmdbWebClient.get()
                            .uri("/movie/{id}", bm.getBookmarkTargetId())
                            .retrieve()
                            .bodyToMono(Map.class)
                            .block();

                    if (detail != null) {
                        bm.setTitle((String) detail.get("title"));

                        Object posterPath = detail.get("poster_path");
                        if (posterPath != null) {
                            bm.setImage("https://image.tmdb.org/t/p/w500" + posterPath);
                        }
                    }
                } catch (Exception e) {
                    System.out.println("TMDB 보강 실패 movieId="
                            + bm.getBookmarkTargetId());
                }
            }

            // 🤖 music_ai 는 DB에 저장된 ext 값 그대로 사용 (merge)
            if ("music_ai".equals(bm.getBookmarkTargetType())) {
                bm.setMusicTitle(bm.getExtMusicTitle());
                bm.setMusicSinger(bm.getExtMusicSinger());
                bm.setMusicImagePath(bm.getExtMusicImagePath());
            }
        }

        return bookmarks;
    }
}
