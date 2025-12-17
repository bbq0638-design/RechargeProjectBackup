import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';

export default function DropdownModalKSA({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  top,
  left,
  width,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View
          style={[
            styles.dropdownContainer,
            {top: top + 40, left: left, width: width || 150},
          ]}>
          <ScrollView nestedScrollEnabled={true}>
            {options.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.item,
                  selectedValue === item.value && styles.selectedItem,
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}>
                <Text style={{fontSize: 14, color: '#000000'}}>{item.label}</Text>
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
    maxHeight: 220,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 12,
    paddingVertical: 6,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  selectedItem: {
    backgroundColor: '#E5F1FB',
    borderRadius: 8,
  },
});