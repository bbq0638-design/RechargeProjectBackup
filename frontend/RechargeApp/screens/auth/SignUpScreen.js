import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';
import SelectableButton from '../../components/common/SelectableButton';
import {
  signup,
  checkUserId,
  checkUserNickname,
  sendEmailAuth,
} from '../../utils/api';

export default function SignUpScreen({navigation, route}) {
  const [userEmail, setUserEmail] = useState('');
  const [userGender, setUserGender] = useState('');
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [userName, setUserName] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userCarModel, setUserCarModel] = useState('');

  const [emailVerified, setEmailVerified] = useState(false); // 🔥 추가

  const [phonePrefix, setPhonePrefix] = useState('010');
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 100,
  });

  const dropdownRef = useRef(null);
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const nicknameRef = useRef(null);
  const birthRef = useRef(null);

  React.useEffect(() => {
    if (route?.params?.emailVerified) {
      setEmailVerified(true);
      if (route?.params?.userEmail) {
        setUserEmail(route.params.userEmail); // 이메일 유지
      }
    }
  }, [route]);

  const phonePrefixOptions = ['010', '011', '016', '017', '018', '019'];

  const openPhoneDropdown = () => {
    dropdownRef.current.measure((fx, fy, width, height, px, py) => {
      setDropdownPos({top: py + height + 4, left: px, width});
      setShowPhoneDropdown(true);
    });
  };

  const handleSignup = async () => {
    if (!userId || !userPwd || !userNickname || !userEmail || !userName) {
      return Alert.alert('알림', '필수 입력 값을 입력해주세요.');
    }

    if (!emailVerified) {
      return Alert.alert('경고', '이메일 인증을 완료해주세요!');
    }

    const userData = {
      userId,
      userPwd,
      userEmail,
      userName,
      userNickname,
      userBirth,
      userGender: userGender === 'male' ? 'M' : 'F',
      userPhone: phonePrefix + userPhone,
      userCarModel,
      createId: userId,
      emailVerified: 'Y', // 🔥 핵심 추가!
    };

    try {
      const res = await signup(userData);
      Alert.alert('회원가입 완료', res);
      navigation.navigate('LoginMain');
    } catch (err) {
      Alert.alert('회원가입 실패', err);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>회원가입</Text>

      <View style={styles.inputWithButton}>
        <TextInput
          ref={emailRef}
          width={'75%'}
          label="이메일"
          value={userEmail}
          onChangeText={text => {
            setUserEmail(text);
            setEmailVerified(false); // 🔥 이메일 변경 시 인증 초기화
          }}
          placeholder="이메일을 입력하세요"
          style={{marginBottom: 20, marginTop:10}}
        />

        {emailVerified ? (
          <Text style={{color: 'green', fontSize: 12, marginLeft: 6}}>
            ✓ 인증완료
          </Text>
        ) : (
          <Button
            text="인증하기"
            type="submit"
            width={65}
            fontSize={12}
            style={styles.checkEmailBtn}
            onPress={async () => {
              if (!userEmail.includes('@')) {
                return Alert.alert('알림', '올바른 이메일을 입력해주세요.');
              }

              try {
                const result = await sendEmailAuth(userEmail);
                if (result === false) {
                  return Alert.alert('실패', '이미 존재하는 이메일입니다.');
                }
                Alert.alert('메일 전송 완료', '메일을 확인해주세요!');
              } catch (err) {
                Alert.alert('실패', err);
              }
            }}
          />
        )}
      </View>

      <View style={styles.inputWithButton}>
        <TextInput
          label="아이디"
          placeholder="아이디를 입력하세요"
          width={'75%'}
          value={userId}
          onChangeText={setUserId}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <Button
          text="중복확인"
          type="submit"
          width={65}
          fontSize={12}
          style={styles.checkBtn}
          onPress={async () => {
            if (!userId) return Alert.alert('알림', '아이디를 입력해주세요!');
            const exists = await checkUserId(userId);
            if (exists) Alert.alert('중복', '이미 사용 중인 아이디입니다.');
            else Alert.alert('확인', '사용 가능한 아이디입니다!');
          }}
        />
      </View>

      <View style={styles.inputWithButton}>
        <TextInput
          ref={passwordRef}
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          secureTextEntry
          value={userPwd}
          onChangeText={setUserPwd}
          style={{marginTop: 20}}
        />
      </View>

      
      <View style={styles.inputWithButton}>
        <TextInput
          ref={nameRef}
          label="이름"
          placeholder="이름을 입력하세요"
          value={userName}
          onChangeText={setUserName}
          style={{marginTop: 20}}
          returnKeyType="next"
          onSubmitEditing={() => nicknameRef.current?.focus()}
        />
      </View>

      <View style={styles.inputWithButton}>
        <TextInput
          ref={nicknameRef}
          width={'75%'}
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          value={userNickname}
          onChangeText={setUserNickname}
          style={{marginTop: 20}}
          returnKeyType="next"
          onSubmitEditing={() => birthRef.current?.focus()}
        />

        <Button
          text="중복확인"
          type="submit"
          width={65}
          fontSize={12}
          style={styles.checknicknameBtn}
          onPress={async () => {
            if (!userNickname)
              return Alert.alert('알림', '닉네임을 입력해주세요!');
            const exists = await checkUserNickname(userNickname);
            if (exists) Alert.alert('중복', '이미 사용 중인 닉네임입니다.');
            else Alert.alert('확인', '사용 가능한 닉네임입니다!');
          }}
        />
      </View>

      <View style={styles.inputWithButton}>
        <TextInput
          ref={birthRef}
          label="생년월일"
          placeholder="생년월일 8자리 (예: 19900101)"
          value={userBirth}
          onChangeText={setUserBirth}
          style={{marginTop: 20}}
        />
      </View>

      <View style={styles.radioWithButton}>
        <Text style={styles.genderHeader}>성별</Text>
        <View style={styles.genderBtn}>
          <SelectableButton
            label="남자"
            selected={userGender === 'male'}
            onPress={() => setUserGender(userGender === 'male' ? '' : 'male')}
            style={{marginRight: 10, width: 148, borderRadius: 10}}
          />
          <SelectableButton
            label="여자"
            selected={userGender === 'female'}
            onPress={() =>
              setUserGender(userGender === 'female' ? '' : 'female')
            }
            style={{width: 148, borderRadius: 10}}
          />
        </View>

        <View style={styles.phoneWithButton}>
          <Text style={styles.phoneHeader}>전화번호</Text>

          <View style={styles.phoneRow}>
            {/* 🔽 앞자리 드롭다운 영역 */}
            <TouchableOpacity
              ref={dropdownRef}
              style={styles.phonePrefixBox}
              onPress={openPhoneDropdown}>
              <Text style={styles.phonePrefixText}>{phonePrefix}</Text>
              <Text style={{fontSize: 12}}>▼</Text>
            </TouchableOpacity>

            {/* 전화번호 입력 */}
            <TextInput
              width={'87%'}
              placeholder="전화번호를 입력하세요 (- 제외)"
              keyboardType="number-pad"
              value={userPhone}
              onChangeText={setUserPhone}
              maxLength={8}
              style={{marginLeft: 10}}
            />
          </View>
          <Modal visible={showPhoneDropdown} transparent animationType="fade">
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={() => setShowPhoneDropdown(false)}
                activeOpacity={1}
              />
              <View
                style={[
                  styles.dropdownBox,
                  {
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width: dropdownPos.width,
                  },
                ]}>
                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}>
                  {phonePrefixOptions.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.phoneOption,
                        phonePrefix === item && styles.phoneOptionSelected,
                      ]}
                      onPress={() => {
                        setPhonePrefix(item);
                        setShowPhoneDropdown(false);
                      }}>
                      <Text style={{fontSize: 14}}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={styles.inputWithButton}>
        <TextInput
          label="차종"
          placeholder="차종을 입력하세요"
          value={userCarModel}
          onChangeText={setUserCarModel}
          style={{marginTop: 20}}
        />
      </View>

      <View style={styles.submitButton}>
        <Button
          text="회원가입"
          type="submit"
          disabled={!emailVerified} // 🔐 인증 전에는 비활성화!
          style={{
            marginTop: 50,
            marginBottom: 20,
            opacity: emailVerified ? 1 : 0.5,
          }}
          onPress={handleSignup}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004E89',
    marginBottom: 20,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '85%',
  },
  checkBtn: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 10,
    marginTop: 25,
    height: 47.5,
  },
  checkBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkEmailBtn: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 10,
    marginBottom: -15,
    height: 47.5,
  },
  checknicknameBtn: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 10,
    marginTop: 45,
    height: 47.5,
  },
  radioWithButton: {
    flexDirection: 'column',
    gap: 8,
    width: '85%',
  },

  genderHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#374151',
    marginTop: 25,
  },
  genderBtn: {
    flexDirection: 'row',
  },
  phoneWithButton: {
    flexDirection: 'column',
    gap: 8,
    width: '85%',
  },
  phoneHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#374151',
    marginTop: 25,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  phonePrefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 70,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  phonePrefixText: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },

  dropdownBox: {
    position: 'absolute',
    backgroundColor: '#fff',
    maxHeight: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 6,
    elevation: 15,
    zIndex: 9999,
  },

  phoneOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  phoneOptionSelected: {
    backgroundColor: '#E5F1FB',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '85%',
  },
});
