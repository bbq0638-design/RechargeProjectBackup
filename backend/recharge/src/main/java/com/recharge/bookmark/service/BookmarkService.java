package com.recharge.bookmark.service;

import com.recharge.bookmark.vo.BookmarkVO;

import java.util.List;
import java.util.Map;

public interface BookmarkService {

    boolean toggleBookmark(BookmarkVO vo);

    boolean checkBookmark(String userId, String targetType, Long targetId);

    Map<Long, Boolean> getBookmarkStatusMap(
            String userId,
            String targetType,
            List<Long> targetIds
    );

    List<BookmarkVO> getUserBookmarks(String userId);
}
