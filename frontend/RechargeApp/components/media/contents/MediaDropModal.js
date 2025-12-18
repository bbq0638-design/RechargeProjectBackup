import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
} from 'react-native';

export default function MediaDropModal({visible, onClose, options = []}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    if (visible) {
      // 🔥 스르륵 등장
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 초기화
      opacity.setValue(0);
      translateY.setValue(-10);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* 배경 클릭 닫기 */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* 🔽 드롭다운 (애니메이션 적용) */}
      <Animated.View
        style={[
          styles.container,
          {
            opacity,
            transform: [{translateY}],
          },
        ]}>
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          {options.map((item, idx) => (
            <Pressable
              key={idx}
              style={styles.row}
              onPress={() => {
                item.onPress?.();
                onClose();
              }}>
              {item.thumbnail && (
                <Image source={{uri: item.thumbnail}} style={styles.thumb} />
              )}

              <View style={{marginLeft: 10}}>
                <Text style={styles.title}>{item.label}</Text>
                {item.sub && <Text style={styles.sub}>{item.sub}</Text>}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    position: 'absolute',
    top: 56, // input 48 + 여백
    left: 0,
    right: 0,
    maxHeight: 260,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 12,
    zIndex: 9999,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 44,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  sub: {
    fontSize: 12,
    marginTop: 2,
    color: '#6B7280',
  },
});
