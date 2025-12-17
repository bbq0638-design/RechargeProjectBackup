import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';

const COLORS = {
  primary: '#004E89',
  white: '#ffffff',
  black: '#000000',
  border: '#D1D5DB',
  shadow: '#000',
};

function SelectableButton({label, selected, onPress, icon, style, textStyle}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: selected ? COLORS.primary : COLORS.white,
          borderColor: selected ? COLORS.primary : COLORS.border,
        },
        style,
      ]}>
      <View style={styles.row}>
        {icon && (
          <View style={styles.iconWrapper}>
            {React.cloneElement(icon, {
              color: selected ? COLORS.white : COLORS.black,
              size: 18,
            })}
          </View>
        )}

        <Text
          style={[
            styles.label,
            {color: selected ? COLORS.white : COLORS.black},
            textStyle,
          ]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default SelectableButton;
