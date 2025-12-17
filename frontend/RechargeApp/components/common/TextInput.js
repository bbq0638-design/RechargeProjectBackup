import React, {useState, forwardRef} from 'react';
import {View, Text, TextInput as RNTextInput, StyleSheet, Platform} from 'react-native';

const COLORS = {
  primary: '#004E89',
  border: '#D1D5DB',
  background: '#ffffff',
  placeholder: '#9CA3AF',
  text: '#111827',
  error: '#DC2626',
};

const CustomTextInput = forwardRef(
  (
    {
      label,
      value,
      onChangeText,
      placeholder = '',
      secureTextEntry = false,
      errorMessage = '',
      width = '100%',
      height = 48,
      style,
      inputStyle,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    return (
      <View style={[{width}, style]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <RNTextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            {
              height,
              borderColor: focused ? COLORS.primary : COLORS.border,
            },
            inputStyle,
          ]}
          {...props}
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#374151',
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
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
  errorText: {
    marginTop: 6,
    color: COLORS.error,
    fontSize: 13,
  },
});

export default CustomTextInput;
