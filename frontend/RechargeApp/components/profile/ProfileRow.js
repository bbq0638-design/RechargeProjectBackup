import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';

export default function ProfileRow({label, value, editable = false, onSave}) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(inputValue);
    setEditing(false); //수정모드 종료
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      {!editing ? (
        <>
          <Text style={styles.value}>{value}</Text>
          {editable && (
            <Pressable
              onPress={() => setEditing(true)}
              style={({pressed}) => [
                styles.actionButton,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.actionText}>수정</Text>
            </Pressable>
          )}
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            autoFocus={true} //수정 모드 진입 시 자동포터스
          />
          <Pressable
            onPress={handleSave}
            style={({pressed}) => [
              styles.actionButton,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.actionText}>저장</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    width: 70,
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: '#444',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
  },
  actionButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: '#aaaaaa',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
