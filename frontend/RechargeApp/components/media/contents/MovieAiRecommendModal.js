import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../common/Button';
import CustomTextInput from '../../common/TextInput';
import MediaCards from '../cards/MediaCards';
import SelectableButton from '../../common/SelectableButton';
import LoadingAnimation from '../../common/LoadingAnimation';
import {fetchAiMovieRecommend} from '../../../utils/Movieapi';

function MovieAiRecommendModal({visible, onClose, onResultPress}) {
  const contentType = 'movie';

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = id => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const placeholder = '예) 맑은 날씨에 어울리는 영화 추천해줘';

  /** 🔥 모달 닫힐 때 상태 초기화 */
  useEffect(() => {
    if (!visible) {
      setItems([]);
      setQuery('');
      setLoading(false);
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();

    try {
      setLoading(true);

      const data = await fetchAiMovieRecommend(query);

      const formatted = data.map(item => ({
        id: item.movieId,
        title: item.movieTitle,
        image: item.moviePoster,
      }));

      setItems(formatted);
    } catch (e) {
      console.log('AI 추천 오류', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.title}>AI 영화 추천</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* 입력창 */}
        <CustomTextInput
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
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
        <ScrollView
          contentContainerStyle={styles.results}
          showsVerticalScrollIndicator={false}>
          {loading ? (
            <LoadingAnimation size={90} />
          ) : items.length > 0 ? (
            <View style={styles.grid}>
              {items.map(item => (
                <MediaCards
                  key={item.id}
                  title={item.title}
                  image={item.image}
                  variant="movie"
                  isFavorite={!!favorites[item.id]}
                  onFavoriteToggle={() => toggleFavorite(item.id)}
                  style={{marginLeft: 15, marginBottom: 22}}
                  onPress={() => {
                    onClose();
                    onResultPress?.(item, contentType);
                  }}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.empty}>추천 결과를 찾을 수 없습니다.</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    padding: 10,
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
    marginTop: 15,
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
    paddingBottom: 50,
  },
});

export default MovieAiRecommendModal;
