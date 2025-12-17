import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';

export default function DropdownModalAuto({
  visible,
  options,
  selectedValue,
  onSelect,
  top,
  left,
  width,
}) {
  if (!visible) return null;

  return (
    <View
      style={[
        styles.dropdownContainer,
        {
          top: top, // 정확한 TextInput 아래 좌표
          left: left,
          width: width || 200,
        },
      ]}>
      <ScrollView nestedScrollEnabled={true}>
        {options.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.item,
              selectedValue === item.value && styles.selectedItem,
            ]}
            onPress={() => onSelect(item)}>
            <Text style={{fontSize: 14}}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    maxHeight: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 12,
    paddingVertical: 6,
    zIndex: 9999,
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
