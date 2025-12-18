import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Keyboard,
  findNodeHandle,
  UIManager,
} from 'react-native';
import axios from 'axios';
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
  hideResults = false,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPressed, setSearchPressed] = useState(false);
  const typingTimeoutRef = useRef(null);

  // 🔥 DropdownModal 위치 계산용 state
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({top: 0, left: 0, width: 0});

  const inputRef = useRef(null);

  /** 🔍 검색 함수 */
  const search = async text => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      if (type === 'movie') {
        const data = await searchMovies(text);
        setResults(data.slice(0, 5));
      }

      if (type === 'music') {
        const data = await searchMusic(text);
        setResults(data.slice(0, 5));
      }
    } catch (e) {
      console.log('MediaSearchBar Error:', e);
    } finally {
      setLoading(false);
    }
  };


  /** 🔥 드롭다운 위치 측정 후 모달 열기 */
  const openDropdown = () => {
    if (!inputRef.current) return;

    UIManager.measureInWindow(
      findNodeHandle(inputRef.current),
      (x, y, width, height) => {
        setDropdownPos({top: y + height, left: x, width});
        setModalVisible(true);
      },
    );
  };

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
        <View ref={inputRef} collapsable={false} style={{flex: 1}}>
          <CustomTextInput
            value={query}
            onChangeText={text => {
              setQuery(text);
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }
              if(!text.trim()) {
                setResults([]);
                setModalVisible(false);
                return;
              }

              typingTimeoutRef.current = setTimeout(() => {
                search(text);
                openDropdown();
              }, 700);
            }}
            placeholder={placeholder}
            blurOnSubmit={false}
            returnKeyType="search"
            height={48}
          />
        </View>

        <Pressable
          onPress={() => {
            search(query);
            openDropdown();
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

      {/* 로딩 */}
      {loading && <LoadingAnimation style={{marginTop: 10}} size={40} />}

      {/* 🔥 DropdownModal 적용 */}
      <MediaDropModal
        visible={modalVisible && results.length > 0 && !loading}
        onClose={() => setModalVisible(false)}
        top={dropdownPos.top}
        left={dropdownPos.left}
        width={dropdownPos.width}
        options={results.map(r => ({
          label: type === 'movie' ? r.movieTitle : r.musicTitle,
          sub: type === 'movie' ? r.movieDate : r.musicSinger,
          thumbnail:
            type === 'movie'
              ? r.moviePoster
                ? r.moviePoster
                : 'https://via.placeholder.com/92x138'
              : r.musicImagePath,
          onPress: () => handleSelect(r),
        }))} // 여기서 선택 처리
      />
    </View>
  );
}

export default MediaSearchBar;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#004E89',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 4,
  },
});
