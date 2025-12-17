import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import TextInput from '../../components/common/TextInput';
import Button from '../../components/common/Button';

export default function FindIdResultScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>아이디 찾기 결과</Text>
      </View>

      <View style={styles.centerBox}>
        <View style={styles.textBox}>
          <Text style={styles.firstText}>
            아이디를 가입된 이메일로 발송했습니다.
          </Text>
          <Text style={styles.secondText}>이메일을 확인해주세요.</Text>
        </View>
        <View style={styles.btnArea}>
          <Button
            text="로그인 하러 가기"
            type="submit"
            width="44%"
            style={{marginTop: 30, marginRight: 10}}
            onPress={() => navigation.navigate('LoginMain')}
          />
          <Button
            text="비밀번호 찾기"
            type="submit"
            width="44%"
            style={{marginTop: 30}}
            onPress={() => navigation.navigate('FindPwdScreen')}
          />
        </View>
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
  centerBox: {
    width: '100%',
    alignItems: 'center',
  },
  textBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 40,
    width: '90%',
    alignItems: 'center',
    elevation: 2,
  },

  firstText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  secondText: {
    fontSize: 14,
  },
  btnArea: {
    flexDirection: 'row',
  },
});
