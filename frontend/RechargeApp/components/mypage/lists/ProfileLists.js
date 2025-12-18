import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Button from '../../common/Button';

export default function ProfileList({
  data = [],
  mode,
  myUserId,
  onPressFollow,
  onPressUnfollow,
  onPressProfile,
}) {
  return (
    <View style={styles.listWrapper}>
      {data.map(user => {
        console.log('🔥 ProfileList render nickname:', user.userNickname);
        const targetUserId =
          mode === 'following' ? user.followingId : user.followerId;

        const nickname = user.userNickname;
        const isMe = String(targetUserId) === String(myUserId);

        return (
          <View key={targetUserId} style={styles.row}>
            {/* 닉네임 영역 */}
            <Pressable
              style={styles.nameBox}
              onPress={() => onPressProfile?.(targetUserId, nickname)}>
              <Text style={styles.name}>{nickname}</Text>
            </Pressable>

            {/* 버튼 영역 */}
            <View style={styles.buttonBox}>
              {!isMe && mode === 'following' && (
                <Button
                  type="cancel"
                  text="팔로잉 취소"
                  width={110}
                  height={40}
                  borderRadius={20}
                  onPress={() => onPressUnfollow(targetUserId)}
                />
              )}

              {!isMe && mode === 'follower' && (
                <Button
                  type={user.isFollowing > 0 ? 'cancel' : 'submit'}
                  text={user.isFollowing > 0 ? '언팔로우' : '팔로우'}
                  width={110}
                  height={40}
                  borderRadius={20}
                  onPress={() =>
                    user.isFollowing > 0
                      ? onPressUnfollow(targetUserId)
                      : onPressFollow(targetUserId)
                  }
                />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
  },
  nameBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#001c33',
  },
  buttonBox: {
    width: 120,
    alignItems: 'flex-end',
  },
});