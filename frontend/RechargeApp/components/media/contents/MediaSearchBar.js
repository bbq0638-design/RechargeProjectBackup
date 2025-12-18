import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Pressable, Keyboard} from 'react-native';
import CustomTextInput from '../../common/TextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingAnimation from '../../common/LoadingAnimation';
import MediaDropModal from './MediaDropModal';
import {searchMovies} from '../../../utils/Movieapi';
import {searchMusic} from '../../../utils/Musicapi';

function MediaSearchBar({
  type = 'movie',
  placeholder = '영화 제목을 검색하세요',
  onSelect,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPressed, setSearchPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const typingTimeoutRef = useRef(null);

  /** 🔍 검색 함수 (기존 로직 그대로) */
  const search = async text => {
    if (!text.trim()) {
      setResults([]);
      setModalVisible(false);
      return;
    }

    try {
      setLoading(true);

      let data = [];
      if (type === 'movie') {
        data = await searchMovies(text);
      } else {
        data = await searchMusic(text);
      }

      const sliced = data.slice(0, 5);
      setResults(sliced);
      setModalVisible(sliced.length > 0);
    } catch (e) {
      console.log('MediaSearchBar Error:', e);
    } finally {
      setLoading(false);
    }
  };

  /** 언마운트 시 타이머 정리 */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  /** 리스트 클릭 */
  const handleSelect = item => {
    Keyboard.dismiss();
    setQuery('');
    setResults([]);
    setModalVisible(false);
    onSelect?.(item);
  };

  return (
    <View style={styles.wrapper}>
      {/* 입력창 + 검색 버튼 */}
      <View style={styles.inputRow}>
        {/* ⭐ 입력창 flex 영역 */}
        <View style={styles.inputBox}>
          <CustomTextInput
            value={query}
            placeholder={placeholder}
            height={48}
            blurOnSubmit={false}
            returnKeyType="search"
            onChangeText={text => {
              setQuery(text);

              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }

              if (!text.trim()) {
                setResults([]);
                setModalVisible(false);
                return;
              }

              typingTimeoutRef.current = setTimeout(() => {
                search(text);
              }, 700);
            }}
          />
        </View>

        {/* 🔍 검색 버튼 (기존 동작 그대로) */}
        <Pressable
          onPress={() => {
            if (!query.trim() || loading) return;
            search(query);
          }}
          onPressIn={() => setSearchPressed(true)}
          onPressOut={() => setSearchPressed(false)}
          style={[
            styles.searchButton,
            searchPressed && {backgroundColor: '#003766'},
          ]}>
          <MaterialCommunityIcons name="magnify" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* ✅ 기존 로딩 애니메이션 유지 */}
      {loading && <LoadingAnimation style={{marginTop: 10}} size={40} />}

      {/* 자동완성 드롭다운 */}
      <MediaDropModal
        visible={modalVisible && results.length > 0 && !loading}
        onClose={() => setModalVisible(false)}
        options={results.map(r => ({
          label: type === 'movie' ? r.movieTitle : r.musicTitle,
          sub: type === 'movie' ? r.movieDate : r.musicSinger,
          thumbnail:
            type === 'movie'
              ? r.moviePoster || 'https://via.placeholder.com/92x138'
              : r.musicImagePath,
          onPress: () => handleSelect(r),
        }))}
      />
    </View>
  );
}

export default MediaSearchBar;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative', // 기준점
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // ⭐ 버튼 튐 방지
  },

  inputBox: {
    flex: 1, // ⭐ 입력창이 남는 영역 차지
    minWidth: 0, // ⭐ Android 필수 (overflow 방지)
  },

  searchButton: {
    marginLeft: 10,
    backgroundColor: '#004E89',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // ⭐ 버튼 밀림/이탈 방지
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 4,
  },
});