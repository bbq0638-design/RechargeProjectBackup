package com.recharge.bookmark.dao;

import com.recharge.bookmark.vo.BookmarkVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BookmarkDAO {

    int existsBookmark(BookmarkVO vo);

    int insertBookmark(BookmarkVO vo);

    // 🔥 AI 음악 북마크 추가 (merge)
    int insertAiMusicBookmark(BookmarkVO vo);

    int deleteBookmark(BookmarkVO vo);

    List<Long> selectBookmarkedTargetIds(
            @Param("userId") String userId,
            @Param("targetType") String targetType,
            @Param("targetIds") List<Long> targetIds
    );

    List<BookmarkVO> selectUserBookmarks(String userId);
}
