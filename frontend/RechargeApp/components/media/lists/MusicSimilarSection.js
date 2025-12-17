import React, {useEffect, useState} from 'react';
import MediaListsSection from './MediaListsSection';

export default function MusicSimilarSection({genreCode, onEmpty}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadSimilar();
  }, [genreCode]);

  const loadSimilar = async () => {
    try {
      const data = await fetchSimilarMusic(genreCode);
      setItems(data);

      if (data.length === 0 && onEmpty) onEmpty();
    } catch (err) {
      console.log('비슷한 음악 로드 실패:', err);
    }
  };

  return (
    <MediaListsSection
      title="비슷한 분위기의 음악"
      items={items}
      variant="music"
      loading={loading}
    />
  );
}
