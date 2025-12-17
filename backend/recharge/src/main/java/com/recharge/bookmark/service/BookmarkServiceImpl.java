package com.recharge.bookmark.service;

import com.recharge.bookmark.dao.BookmarkDAO;
import com.recharge.bookmark.vo.BookmarkVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkDAO bookmarkDAO;

    /** ⭐ 토글 */
    @Override
    @Transactional
    public boolean toggleBookmark(BookmarkVO vo) {
        int exists = bookmarkDAO.existsBookmark(vo);

        if (exists > 0) {
            bookmarkDAO.deleteBookmark(vo);
            return false;
        } else {
            bookmarkDAO.insertBookmark(vo);
            return true;
        }
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
        return bookmarkDAO.selectUserBookmarks(userId);
    }
}
