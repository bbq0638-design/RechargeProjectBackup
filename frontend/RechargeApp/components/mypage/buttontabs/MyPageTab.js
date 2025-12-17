import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

function MyPageTab({labels = ['Left', 'Right'], activeIndex = 0, onTabChange}) {
  return (
    <View style={styles.container}>
      {labels.map((label, index) => {
        const isActive = activeIndex === index;

        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => onTabChange(index)}>
            <Text style={[styles.tabText, isActive && styles.activeText]}>
              {label}
            </Text>

            {isActive && <View style={styles.underline} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: '#687280',
    fontWeight: '600',
  },
  activeText: {
    color: '#004e89',
    fontWeight: '700',
  },
  underline: {
    position: 'absolute',
    bottom: 2,
    height: 3,
    width: '100%',
    backgroundColor: '#0a4fa3',
  },
});

export default MyPageTab;
