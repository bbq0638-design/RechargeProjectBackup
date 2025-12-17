import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import MediaSearchBar from '../../../components/media/contents/MediaSearchBar';
import MusicPlaylistItem from '../../../components/media/contents/MusicPlaylistItem';
import LoadingAnimation from '../../../components/common/LoadingAnimation';
import Button from '../../../components/common/Button';
import TextArea from '../../../components/common/TextArea';
import CustomTextInput from '../../../components/common/TextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createMusicPost,
  updateMusicPost,
  fetchMusicPostDetail,
} from '../../../utils/Musicapi';

function MusicPostScreen({route}) {
  const isEdit = !!route?.params?.postId;
  const postId = route?.params?.postId;

  const navigation = useNavigation();

  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const isSubmitDisabled =
    playlist.length === 0 || !reason.trim() || !title.trim();

  useEffect(() => {
    if (playlist.length === 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [playlist]);

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    loadUserId();
  }, []);

  useEffect(() => {
    if (isEdit) {
      loadPostData();
    }
  }, [isEdit]);

  const loadPostData = async () => {
    setLoading(true);
    try {
      const detail = await fetchMusicPostDetail(postId);

      setTitle(detail.musicPostTitle);
      setReason(detail.musicPostText);

      const normalized =
        detail.playlist?.map(item => normalizeTrack(item)) ?? [];
      setPlaylist(normalized);
    } finally {
      setLoading(false);
    }
  };

  const normalizeTrack = item => ({
    musicId: item.musicId,
    musicTitle: item.musicTitle,
    musicSinger: item.musicSinger,
    musicImagePath: item.musicImagePath,
    musicPreviewUrl: item.musicPreviewUrl,
  });

  /** 🎵 곡 추가 */
  const addTrack = track => {
    const n = normalizeTrack(track);
    setPlaylist(prev => [...prev, n]);
  };

  /** 🎵 삭제 */
  const removeTrack = index => {
    setPlaylist(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.log('유저 정보 없음');
      return;
    }

    try {
      if (isEdit) {
        // ⭐ 수정 모드
        const payload = {
          userId: userId,
          musicPostId: postId,
          musicPostTitle: title,
          musicPostText: reason,
          playlist: playlist,
          updatedId: userId,
        };

        await updateMusicPost(postId, payload);

        console.log('수정 완료!');

        // ⭐ 수정 후 상세로 이동
        navigation.push('MusicDetail', {postId});
      } else {
        // ⭐ 신규 작성 모드
        const payload = {
          userId: userId,
          createId: userId,
          musicPostTitle: title,
          musicPostText: reason,
          playlist: playlist,
        };

        // ⭐ 서버에서 생성된 postId 받기
        const newId = await createMusicPost(payload);

        console.log('등록 완료! Post ID:', newId);

        // ⭐ 새로 생성된 postId로 상세 페이지 이동
        navigation.push('MusicDetail', {postId: newId});
      }
    } catch (err) {
      console.log('저장 실패', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* 🔍 검색창 */}
      <View style={styles.searchWrapper}>
        <MediaSearchBar
          type="music"
          placeholder="음악을 검색하세요"
          hideResults={false}
          onSelect={track => addTrack(track)}
        />
      </View>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* 비어있는 경우 안내 */}
        {!loading && playlist.length === 0 && (
          <Animated.View style={[styles.infoBox, {opacity: fadeAnim}]}>
            <Text style={styles.infoTitle}>음악을 검색해보세요</Text>
            <Text style={styles.infoDesc}>
              음악을 검색해서 플레이리스트에 추가할 수 있어요.
            </Text>
          </Animated.View>
        )}

        {/* 로딩 */}
        {loading && <LoadingAnimation style={{marginTop: 20}} />}

        {/* 플레이리스트 */}
        {!loading && playlist.length > 0 && (
          <View style={{marginTop: 12}}>
            {playlist.map((track, index) => (
              <MusicPlaylistItem
                key={index}
                item={track}
                showDelete={true}
                onDelete={() => removeTrack(index)}
              />
            ))}

            <Button
              type="edit"
              text="곡 다시 선택하기 ✨"
              height={44}
              onPress={() => {
                setPlaylist([]);
              }}
              style={{marginBottom: 16}}
              textStyle={{fontSize: 15}}
            />
          </View>
        )}

        {/* ⭐ 추천글 제목 입력창 */}

        <Text style={styles.reasonLabel}>추천글 제목</Text>

        <CustomTextInput
          placeholder="예: 집중이 잘 되는 음악 플레이리스트"
          value={title}
          onChangeText={setTitle}
          style={{marginTop: 8}}
        />

        {/* 추천 이유 */}
        <Text style={styles.reasonLabel}>이 음악을 추천하는 이유</Text>

        <TextArea
          value={reason}
          onChangeText={setReason}
          placeholder="이 음악을 추천하는 이유를 작성해주세요"
          maxLength={300}
          autoGrow={false}
          style={{marginTop: 8, height: 130}}
        />

        {/* 등록 버튼 */}
        <Button
          type="submit"
          text={isEdit ? '수정하기' : '추천글 등록하기'}
          height={48}
          disabled={isSubmitDisabled}
          onPress={handleSubmit}
          style={{marginTop: 20, marginBottom: 40}}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: '#FAFAFA',
    zIndex: 9999,
    elevation: 9999,
  },
  content: {
    paddingTop: 90,
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: '#FAFAFA',
  },
  infoBox: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    minHeight: 300,
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  infoDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  reasonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginTop: 20,
  },
});

export default MusicPostScreen;
