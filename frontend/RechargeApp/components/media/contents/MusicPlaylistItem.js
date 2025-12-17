import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FavoriteButton from './FavoriteButton';
import IconButton from '../../common/iconButton';

function MusicPlaylistItem({
  item,
  showDelete = false,
  showPreview = false,
  showFavorite = false,
  isFavorite,
  onDelete,
  onPreview,
  onFavoriteToggle,
}) {
  return (
    <View style={styles.row}>
      {/* 상세 화면: 즐겨찾기 버튼 */}
      {showFavorite && (
        <FavoriteButton
          type="square"
          isFavorite={isFavorite}
          onPress={onFavoriteToggle}
          style={{marginRight: 12}}
        />
      )}
      {/* 앨범아트 */}
      <Image source={{uri: item.musicImagePath}} style={styles.thumb} />
      {/* 제목 + 가수 */}
      <View style={styles.info}>
        <Text style={styles.title}>{item.musicTitle}</Text>
        <Text style={styles.artist}>{item.musicSinger}</Text>
      </View>
      {/* 삭제 버튼 */}
      {showDelete && (
        <IconButton
          type="commentDelete" // 🗑 이미 존재함
          size={22}
          color="#444"
          onPress={onDelete}
          style={styles.actionBtn}
        />
      )}
      {/* 미리듣기 버튼 */}
      {showPreview && (
        <IconButton
          type="play" // 🎵 새로 추가한 play 아이콘
          size={26}
          color="#004E89"
          onPress={onPreview}
          style={styles.actionBtn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 15,
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#ddd',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  artist: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  actionBtn: {
    paddingHorizontal: 6,
  },
});
export default MusicPlaylistItem;
