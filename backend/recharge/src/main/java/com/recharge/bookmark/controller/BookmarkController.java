package com.recharge.bookmark.controller;

import com.recharge.bookmark.service.BookmarkService;
import com.recharge.bookmark.vo.BookmarkVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    /** ⭐ 북마크 토글 */
    @PostMapping("/toggle")
    public boolean toggleBookmark(@RequestBody BookmarkVO vo) {
        return bookmarkService.toggleBookmark(vo);
    }

    /** ⭐ 단건 북마크 여부 조회 (상세 페이지용) */
    @GetMapping("/check")
    public boolean checkBookmark(
            @RequestParam String userId,
            @RequestParam String targetType,
            @RequestParam Long targetId
    ) {
        return bookmarkService.checkBookmark(userId, targetType, targetId);
    }

    /** ⭐ 리스트용 북마크 상태 일괄 조회 */
    @PostMapping("/status")
    public Map<Long, Boolean> getBookmarkStatusMap(
            @RequestParam String userId,
            @RequestParam String targetType,
            @RequestBody List<Long> targetIds
    ) {
        return bookmarkService.getBookmarkStatusMap(userId, targetType, targetIds);
    }

    /** ⭐ 특정 유저 전체 북마크 (마이페이지) */
    @GetMapping("/user/{userId}")
    public List<BookmarkVO> getUserBookmarks(@PathVariable String userId) {
        return bookmarkService.getUserBookmarks(userId);
    }
}
