import React, {useEffect, useState} from 'react';
import MediaListsSection from './MediaListsSection';
import {fetchUserMoviePosts} from '../../../utils/Movieapi';

export default function MovieOtherPostsSection({userId, onEmpty, onPressItem}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOtherPosts();
  }, [userId]);

  const loadOtherPosts = async () => {
    try {
      setLoading(true);

      const data = await fetchUserMoviePosts(userId);

      const mapped = data.map(item => ({
        id: item.moviePostId, // key로 사용
        moviePostId: item.moviePostId, // 이동 때 사용
        title: item.moviePostTitle,
        image: item.moviePoster,
        userId: item.userId,
      }));

      setItems(mapped);

      if (data.length === 0 && onEmpty) onEmpty();
    } catch (err) {
      console.log('다른 게시글 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MediaListsSection
      title="이 이용자의 다른 영화 추천"
      items={items}
      variant="movie"
      loading={loading}
      onPressItem={onPressItem}
    />
  );
}
