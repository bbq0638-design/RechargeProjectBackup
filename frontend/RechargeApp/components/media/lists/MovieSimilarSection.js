import React, {useEffect, useState} from 'react';
import MediaListsSection from './MediaListsSection';
import {fetchSimilarMovies} from '../../../utils/Movieapi';

export default function MovieSimilarSection({
  movieId,
  genreCode,
  onEmpty,
  onPressItem,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimilar();
  }, [movieId]);

  const loadSimilar = async () => {
    try {
      setLoading(true);

      const data = await fetchSimilarMovies(movieId);

      // 🔥 고유 key(id) + 필요한 필드 매핑
      const mapped = data.map(item => ({
        id: item.movieId, // React key로 사용할 값
        title: item.movieTitle, // MediaCards에서 title 표기용
        image: item.moviePoster, // poster
      }));

      setItems(mapped);

      if (mapped.length === 0 && onEmpty) onEmpty();
    } catch (err) {
      console.log('비슷한 영화 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MediaListsSection
      title="이런 영화도 추천드려요"
      items={items}
      variant="movie"
      loading={loading}
      onPressItem={onPressItem}
    />
  );
}
