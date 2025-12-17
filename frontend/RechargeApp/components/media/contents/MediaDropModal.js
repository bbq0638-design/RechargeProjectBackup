import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
  Image,
} from 'react-native';

export default function MediaDropModal({
  visible,
  onClose,
  options = [],
  top,
  left,
  width,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}>
        <View
          style={[
            styles.dropdownContainer,
            {top: top, left: left, width: width || 200},
          ]}>
          <ScrollView nestedScrollEnabled={true}>
            {options.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.row}
                onPress={() => {
                  item.onPress?.();
                  onClose();
                }}>
                {/* 🔸 썸네일 (영화/음악 공용) */}
                {item.thumbnail && (
                  <Image source={{uri: item.thumbnail}} style={styles.thumb} />
                )}

                {/* 🔸 텍스트 (제목 + sub) */}
                <View style={{marginLeft: 10}}>
                  <Text style={styles.title}>{item.label}</Text>
                  {item.sub && <Text style={styles.sub}>{item.sub}</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    maxHeight: 260,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 12,
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
