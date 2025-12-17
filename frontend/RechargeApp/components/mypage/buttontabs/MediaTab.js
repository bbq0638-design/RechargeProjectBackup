import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function MediaTab({activeTab = 'movie', onChangeTab}) {
  return (
    <View style={styles.container}>
      {/* 영화 */}
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'movie' && styles.activeButton]}
        onPress={() => onChangeTab('movie')}>
        <MaterialCommunityIcons
          name="movie-open"
          size={18}
          color={activeTab === 'movie' ? '#ffffff' : '#4B5563'}
        />
        <Text
          style={[styles.tabText, activeTab === 'movie' && styles.activeText]}>
          영화
        </Text>
      </TouchableOpacity>

      {/* 음악 */}
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'music' && styles.activeButton]}
        onPress={() => onChangeTab('music')}>
        <MaterialCommunityIcons
          name="music"
          size={18}
          color={activeTab === 'music' ? '#ffffff' : '#4B5563'}
        />
        <Text
          style={[styles.tabText, activeTab === 'music' && styles.activeText]}>
          음악
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: 30,
    alignSelf: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    width: 150,
    textAlign: 'center',
  },
  activeButton: {
    backgroundColor: '#004E89',
  },
  tabText: {
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeText: {
    color: '#ffffff',
  },
});

export default MediaTab;
