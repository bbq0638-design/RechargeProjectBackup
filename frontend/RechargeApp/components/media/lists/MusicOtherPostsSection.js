import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import MediaListsSection from './MediaListsSection';
import {fetchUserMusicPosts} from '../../../utils/Musicapi';

export default function MusicOtherPostsSection({userId, onEmpty}) {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    loadOtherPosts();
  }, [userId]);

  const loadOtherPosts = async () => {
    try {
      setLoading(true);

      const data = await fetchUserMusicPosts(userId);

      // ⭐ 알꽁!님 방식 그대로 매핑 + 고해상도 변환
      const posts = data.map(post => {
        const highRes = post.firstImagePath
          ? post.firstImagePath.replace(/\/\d+x\d+bb\.jpg/, '/200x200bb.jpg')
          : null;

        return {
          id: post.musicPostId, // 카드에서 사용하는 key
          title: post.musicPostTitle, // UI 제목
          author: post.userNickname || post.userId, // 작성자
          image: highRes, // 🔥 고해상도 앨범아트
        };
      });

      setItems(posts);

      if (posts.length === 0 && onEmpty) onEmpty();
    } catch (err) {
      console.log('다른 음악 게시글 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MediaListsSection
      title="이 이용자의 다른 음악 추천"
      items={items}
      variant="music"
      loading={loading}
      onPressItem={item => navigation.push('MusicDetail', {postId: item.id})}
    />
  );
}
