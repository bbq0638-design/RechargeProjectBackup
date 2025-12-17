import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';
import {findPassword} from '../../utils/api';

export default function FindPwdScreen({navigation}) {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleFindPwd = async () => {
    if (!userId || !userName || !userEmail) {
      Alert.alert('입력 오류', '모든 정보를 입력해주세요.');
      return;
    }

    try {
      const req = {
        userId,
        userName,
        userEmail,
      };

      const res = await findPassword(req);

      Alert.alert('메일 전송 완료', '비밀번호 재설정 링크를 보냈습니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('FindPwdResult'),
        },
      ]);
    } catch (error) {
      Alert.alert('오류', error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>비밀번호 찾기</Text>
        <Text style={styles.subText}>
          가입 시 등록한 이메일로 비밀번호를 재설정할 수 있습니다.
        </Text>
      </View>

      <View style={styles.centerBox}>
        <TextInput
          placeholder="아이디를 입력하세요."
          width="85%"
          value={userId}
          onChangeText={setUserId}
          style={styles.idInput}
        />

        <TextInput
          placeholder="이름을 입력하세요."
          width="85%"
          value={userName}
          onChangeText={setUserName}
          style={styles.idInput}
        />
        <TextInput
          placeholder="이메일을 입력하세요."
          width="85%"
          value={userEmail}
          onChangeText={setUserEmail}
        />

        <Button
          text="비밀번호 찾기"
          type="submit"
          width="85%"
          style={{marginTop: 25}}
          onPress={handleFindPwd}
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
