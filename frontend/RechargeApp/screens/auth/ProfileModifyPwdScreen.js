import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';
import {profileResetPassword} from '../../utils/api';

export default function ProfileModifyPwdScreen({navigation}){

  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

const handleReset = async () => {
    if (!newPwd || !confirmPwd) {
      Alert.alert('입력오류', '모든 항목을 입력하세요.');
      return;
    }

    if (newPwd !== confirmPwd) {
      Alert.alert('입력오류', '두 비밀번호가 일치하지 않습니다.');
      return;
    }


    try {
      const req = {
        userPwd: newPwd,
      };

      console.log('비밀번호 재설정 요청', req);
      await profileResetPassword(req);

      Alert.alert('완료', '비밀번호가 변경되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('오류', error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>비밀번호 변경</Text>
        <Text style={styles.subText}>새로운 비밀번호를 설정해주세요.</Text>
      </View>

      <View style={styles.centerBox}>
        <TextInput
          placeholder="새로운 비밀번호를 입력해주세요."
          width="85%"
          secureTextEntry
          value={newPwd}
          onChangeText={setNewPwd}
          style={styles.idInput}
        />

        <TextInput
          placeholder="비밀번호 확인을 해주세요. ."
          width="85%"
          secureTextEntry
          value={confirmPwd}
          onChangeText={setConfirmPwd}
          style={styles.idInput}
        />

        <Button
          text="비밀번호 재설정하기"
          type="submit"
          width="85%"
          style={{marginTop: 25}}
          onPress={handleReset}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#004E89',
    marginBottom: 5,
  },
  subText: {
    fontSize: 13,
    color: '#374151',
  },
  centerBox: {
    width: '100%',
    alignItems: 'center',
  },
  idInput: {
    marginBottom: 15,
  },
  findArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  findText: {
    color: '#004E89',
    fontWeight: '800',
  },
  findAreaText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    paddingRight: 3,
    paddingLeft: 3,
  },
  pressedText: {
    opacity: 0.6,
  },
});
