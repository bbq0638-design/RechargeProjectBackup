import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import ProfileHeader from '../../components/mypage/contents/ProfileHeader';
import MyPageTab from '../../components/mypage/buttontabs/MyPageTab';
import MyPostMediaList from '../../components/mypage/contents/MyPostMediaList';
import FavoriteMediaList from '../../components/mypage/contents/FavoriteMediaList';

import {logout} from '../../utils/api';
import {getUserFeed} from '../../utils/MyPageApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MyPageScreen({navigation, setIsLoggedIn}) {
  const [myUserId, setMyUserId] = useState(null);
  const [feed, setFeed] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /** 🔹 내 피드 조회 */
  const fetchMyFeed = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (!id) return;

      setMyUserId(id);
      const feedData = await getUserFeed(id);
      setFeed(feedData);
    } catch (e) {
      console.log('마이페이지 조회 실패:', e);
    }
  };

  /** 🔹 최초 진입 */
  useEffect(() => {
    fetchMyFeed();
  }, []);

  /** 🔹 FollowScreen 다녀오면 자동 갱신 */
  useFocusEffect(
    useCallback(() => {
      fetchMyFeed();
    }, []),
  );

  /** 🔹 로그아웃 */
const handleLogout = async () => {
  const result = await logout();
  if (result) {
    Alert.alert('로그아웃', '정상적으로 로그아웃되었습니다.');
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
  }
};

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#F8F9F9'}}
      showsVerticalScrollIndicator={false}>
      {/* ⭐ 프로필 헤더 */}
      {feed && (
        <ProfileHeader
          nickname={feed.userNickname}
          isMine={true}
          postCount={feed.totalCount}
          followerCount={feed.totalFollower}
          followingCount={feed.totalFollowing}
          onLogout={handleLogout}
          onPressFollower={() =>
            navigation.navigate('Follow', {
              nickname: feed.userNickname,
              type: 'follower',
              targetUserId: myUserId,
            })
          }
          onPressFollowing={() =>
            navigation.navigate('Follow', {
              nickname: feed.userNickname,
              type: 'following',
              targetUserId: myUserId,
            })
          }
        />
      )}

      {/* ⭐ 탭 */}
      <MyPageTab
        labels={['내 게시글', '즐겨찾기']}
        activeIndex={activeIndex}
        onTabChange={setActiveIndex}
      />

      {/* ⭐ 내 게시글 */}
      {activeIndex === 0 && myUserId && (
        <MyPostMediaList
          userId={myUserId}
          onPressItem={(item, type) => {
            if (type === 'movie') {
              navigation.navigate('Movie', {
                screen: 'MovieDetail',
                params: {
                  movieId: item.id,
                  type: 'post',
                },
              });
            }

            if (type === 'music') {
              navigation.navigate('Music', {
                screen: 'MusicDetail',
                params: {
                  postId: item.id,
                  type: 'post',
                },
              });
            }
          }}
        />
      )}

      {/* ⭐ 즐겨찾기 */}
      {activeIndex === 1 && myUserId && (
        <FavoriteMediaList
          userId={myUserId}
          onPressItem={(item, type) => {
            if (type === 'movie') {
              navigation.navigate('Movie', {
                screen: 'MovieDetail',
                params: {
                  movieId: item.id,
                  type: 'popular',
                },
              });
            }

            if (type === 'moviepost') {
              navigation.navigate('Movie', {
                screen: 'MovieDetail',
                params: {
                  movieId: item.id,
                  type: 'post',
                },
              });
            }
          }}
        />
      )}
    </ScrollView>
  );
}

export default MyPageScreen;
