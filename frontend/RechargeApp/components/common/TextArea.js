// components/common/TextArea.js
import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

const COLORS = {
  border: '#D1D5DB',
  focus: '#004E89',
  placeholder: '#9CA3AF',
  text: '#111827',
};

export default function TextArea({
  value,
  onChangeText,
  placeholder = '',
  maxLength = 300,
  autoGrow = true,
  disabled = false,
  style,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        editable={!disabled}
        multiline
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          {
            borderColor: focused ? COLORS.focus : COLORS.border,
            flex: autoGrow ? undefined : 1,
          },
        ]}
        maxLength={maxLength}
        textAlignVertical="top"
      />

      {/* 글자 수 표시 */}
      <Text style={styles.lengthText}>
        {value?.length ?? 0} / {maxLength}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: '#fff',

    // IOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    //Android
    elevation: 2,
  },
  lengthText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
});
