package com.recharge.bookmark.dao;

import com.recharge.bookmark.vo.BookmarkVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BookmarkDAO {

    int existsBookmark(BookmarkVO vo);

    int insertBookmark(BookmarkVO vo);

    int deleteBookmark(BookmarkVO vo);

    List<Long> selectBookmarkedTargetIds(
            String userId,
            String targetType,
            List<Long> targetIds
    );

    List<BookmarkVO> selectUserBookmarks(String userId);
}
