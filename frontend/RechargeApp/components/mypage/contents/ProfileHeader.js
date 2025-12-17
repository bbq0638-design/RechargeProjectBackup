import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import IconButton from '../../common/iconButton';
import Button from '../../common/Button';

function ProfileHeader({
  nickname = '사용자 닉네임',
  postCount = '0',
  followerCount = '0',
  followingCount = '0',
  isMine = true,

  // actions
  onLogout,
  onReport,
  onToggleFollow,

  // follow state
  isFollowing = false,

  // navigation
  onPressFollower,
  onPressFollowing,
}) {
  return (
    <View style={styles.container}>
      {/* 상단 닉네임 + 버튼 */}
      <View style={styles.topRow}>
        <Text style={styles.nickname}>{nickname}</Text>
        {isMine ? (
          <IconButton
            type="logout"
            size={22}
            color="#6B7280"
            onPress={onLogout}
          />
        ) : (
          <></>
        )}
      </View>

      {/* 게시글 / 팔로워 / 팔로잉 */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>게시글</Text>
          <Text style={styles.statValue}>{postCount}</Text>
        </View>

        <TouchableOpacity
          style={styles.statBox}
          onPress={onPressFollower}
          disabled={!onPressFollower}>
          <Text style={styles.statLabel}>팔로워</Text>
          <Text style={styles.statValue}>{followerCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statBox}
          onPress={onPressFollowing}
          disabled={!onPressFollowing}>
          <Text style={styles.statLabel}>팔로잉</Text>
          <Text style={styles.statValue}>{followingCount}</Text>
        </TouchableOpacity>
      </View>

      {/* 상대방 페이지일 때만 팔로우 버튼 */}
      {!isMine && (
        <Button
          type={isFollowing ? 'cancel' : 'submit'}
          text={isFollowing ? '팔로우 취소' : '팔로우'}
          height={44}
          style={styles.followBtn}
          onPress={onToggleFollow}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  followBtn: {
    marginTop: 22,
  },
});

export default ProfileHeader;
