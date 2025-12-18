import React, {useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
   Keyboard,
} from 'react-native';
import Modal from 'react-native-modal';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../common/Button';
import CustomTextInput from '../../common/TextInput';
import MediaCards from '../cards/MediaCards';
import LoadingAnimation from '../../common/LoadingAnimation';
import {recommendMusic} from '../../../utils/MusicAiApi';
import {toggleBookmark} from '../../../utils/BookmarkApi';
import {fetchBookmarkStatusMap} from '../../../utils/BookmarkApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MusicAiRecommendModal({visible, onClose, onResultPress}) {
  const contentType = 'music';

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [userId, setUserId] = useState(null);

  const toggleFavorite = async item => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    const trackId = item.id;

    setFavorites(prev => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));

    try {
      const result = await toggleBookmark({
        userId,
        targetType: 'music_ai',
        targetId: trackId,
        extMusicTitle: item.title,
        extMusicSinger: item.artist,
        extMusicImagePath: item.img,
      });

      setFavorites(prev => ({
        ...prev,
        [trackId]: Boolean(result),
      }));
    } catch (e) {
      setFavorites(prev => ({
        ...prev,
        [trackId]: !prev[trackId],
      }));
      console.log('즐겨찾기 토글 실패', e);
    }
  };

  const loadFavorites = async tracks => {
    try {
      const ids = tracks.map(t => t.id);

      const map = await fetchBookmarkStatusMap({
        userId,
        targetType: 'music_ai', // ✅ 수정
        targetIds: ids,
      });

      setFavorites(map); // { trackId: true/false }
    } catch (e) {
      console.log('즐겨찾기 상태 조회 실패', e);
    }
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    setItems([]);

    try {
      const res = await recommendMusic(query);

      // 🔑 Python 응답 → UI용 매핑
      const mapped = (res.tracks || []).map(track => ({
        id: track.trackId,
        title: track.title,
        artist: track.artist,
        img: track.artwork,
        previewUrl: track.previewUrl, // 지금은 안 씀
      }));

      setItems(mapped);
      await loadFavorites(mapped);
    } catch (e) {
      console.log('AI 음악 추천 실패:', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  /** 🔥 모달 닫힐 때 상태 초기화 */
  useEffect(() => {
    if (!visible) {
      setItems([]);
      setQuery('');
      setLoading(false);
    }
  }, [visible]);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (e) {
        console.log('userId 로드 실패', e);
      }
    };

    loadUserId();
  }, []);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.45}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={250}
      animationOutTiming={200}
      style={{margin: 0, justifyContent: 'flex-end'}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.modalContainer}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>AI 음악 추천</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* 입력창 */}
        <CustomTextInput
          value={query}
          onChangeText={setQuery}
          width="100%"
          height={50}
          style={{marginTop: 10}}
        />

        {/* 요청 버튼 */}
        <Button
          type="submit"
          text={loading ? '분석 중...' : '추천받기'}
          height={50}
          onPress={handleSubmit}
          disabled={!query.trim() || loading}
          style={{marginTop: 16}}
        />

        {/* 결과 */}
        <ScrollView contentContainerStyle={styles.results}>
          {loading ? (
            <LoadingAnimation size={90} />
          ) : items.length > 0 ? (
            <View style={styles.grid}>
              {items.map(item => (
                <MediaCards
                  key={item.id}
                  title={item.title}
                  author={item.artist}
                  image={item.img}
                  variant="musicChart"
                  isFavorite={!!favorites[item.id]}
                  onFavoriteToggle={() => toggleFavorite(item)} // 🔥 item 전달
                />
              ))}
            </View>
          ) : (
            <Text style={styles.empty}>추천 결과가 없습니다.</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
  },

  tabs: {
    flexDirection: 'row',
    marginTop: 20,
  },

  results: {
    marginTop: 20,
    paddingBottom: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },

  empty: {
    textAlign: 'center',
    color: '#777',
    fontSize: 15,
  },
});

export default MusicAiRecommendModal;
