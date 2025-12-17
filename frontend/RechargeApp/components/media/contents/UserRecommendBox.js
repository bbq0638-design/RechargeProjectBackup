import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

function UserRecommendBox({reason, nickname, style, onPressNickname}) {
  if (!reason) return null;

  return (
    <View style={[styles.box, style]}>
      <Text style={styles.title}>추천 이유</Text>
      <Text style={styles.text}>{reason}</Text>

      {nickname && (
        <View style={styles.byRow}>
          <Text style={styles.by}>Recommended by </Text>
          <TouchableOpacity onPress={onPressNickname}>
            <Text style={styles.name}>{nickname}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {},
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  byRow: {
    flexDirection: 'row',
    alignItems: 'center', // ★ baseline 맞추는 핵심!
  },
  text: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  by: {
    fontSize: 13,
    color: '#888',
  },
  name: {
    color: '#004E89',
    fontWeight: '600',
  },
});

export default UserRecommendBox;
