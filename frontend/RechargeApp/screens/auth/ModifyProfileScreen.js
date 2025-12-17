import React, {useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileRow from '../../components/profile/ProfileRow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfo, updateUserInfo, apiDeleteUser } from '../../utils/api';

export default function ModifyProfileScreen({navigation, route}) {
  const { setIsLoggedIn } = route.params || {};

  const [userInfo, setUserInfo] = useState(null); //서버에서 가져온 내 정보
  const [loading, setLoading] = useState(true); //로딩 상태


  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          Alert.alert('오류', '로그인 정보가 없습니다.');
          navigation.goBack();
          return;
        }
        const data = await getUserInfo(userId);
        console.log('내 정보 로드 완료:', data);
        setUserInfo(data);
      } catch (error) {
        console.error('정보 로드 실패', error);
        Alert.alert('오류', '회원 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyInfo();
  }, []);

  //정보 수정 핸들러
  const handleWithdraw = async () => {
    Alert.alert(
      "회원 탈퇴",
      "정말 탈퇴하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive", //빨간색으로 표시됨 (iOS)
          onPress: async () => {
            try {
              //백엔드로 {userId: "..."} 전송
              await apiDeleteUser({ userId: userInfo.userId });

              //내부 저장소 비우기(로그아웃 효과)
              await AsyncStorage.clear();

              Alert.alert("알림", "회원 탈퇴가 완료되었습니다.",
                [
                  {
                    text: "확인",
                    onPress: () => {
                      if (setIsLoggedIn) {
                      setIsLoggedIn(false); // -> App.js가 감지하고 AuthStack으로 화면을 바꿈
                    } else {
          
                      console.error("setIsLoggedIn 함수가 전달되지 않았습니다.");
                      
                    }
                  }
                }
      ]);
            } catch (error) {
              console.error("탈퇴 에러:", error);
              Alert.alert("오류", "탈퇴 처리에 실패했습니다.");
            }
          }
        }
      ]
    );
  };

  //수정 저장 핸들러
  //key: DB 컬럼명과 매칭되는 VO 필드명 (userName 등)
  const handleUpdate = async (key, value) => {
    if (!value.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }
    try {
      //서버로 보낼 데이터(Id 필수 + 바뀐 값)
      const payload= {
        userId: userInfo.userId,
        [key]: value, //예: {userNickname: "새닉네임"}
      };

      //서버 api 호출 (PUT/ user/update)
      await updateUserInfo(payload);

      //성공 시 화면(state) 즉시 갱신
      setUserInfo((prev) => ({ ...prev, [key]: value}));
      Alert.alert('성공', '수정되었습니다.');

      //닉네임을 바꿨다면 앱 설정(Storage)도 업데이트
      if (key === 'userNickname') {
        await AsyncStorage.setItem('userNickname', value);
      }
    } catch (error) {
      console.error('수정 실패:', error);
      
      const msg = typeof error === 'string' ? error : '수정 중 문제가 발생했습니다.';
      Alert.alert('실패', msg);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004E89"/>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>프로필 수정</Text>

      <View style={styles.contentbox}>
        {/* 아이디 */}
        <ProfileRow label="아이디" value={userInfo?.userId} />
        <View style={styles.divider} />

        {/* 비밀번호 */}
        <View style={styles.Row}>
          <Text style={styles.label}>비밀번호</Text>
          <Pressable onPress={() => navigation.navigate('ResetPwd')}>
            <View style={styles.linkRow}>
              <Text style={styles.findText}>새 비밀번호 설정</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={18}
                color="#004E89"
              />
            </View>
          </Pressable>
        </View>
        <View style={styles.divider} />

        {/* 이메일 */}
        <ProfileRow label="이메일" value={userInfo?.userEmail} />
        <View style={styles.divider} />

        {/* 이름 */}
        <ProfileRow
          label="이름"
          value={userInfo?.userName}
          editable
          onSave={(val) => handleUpdate('userName', val)}
        />
        <View style={styles.divider} />

        {/* 닉네임 */}
        <ProfileRow
          label="닉네임"
          value={userInfo?.userNickname}
          editable
          onSave={(val) => handleUpdate('userNickname', val)}
        />
        <View style={styles.divider} />

        {/* 전화번호 */}
        <ProfileRow
          label="전화번호"
          value={userInfo?.userPhone}
          editable
          onSave={(val) => handleUpdate('userPhone', val)}
        />
        <View style={styles.divider} />

        {/* 차종 */}
        <ProfileRow label="차종"
         value={userInfo?.userCarModel} 
         editable
          onSave={(val) => handleUpdate('userCarModel', val)}
           />

      </View>
      <View style={styles.deleteUserBox}>
        <Pressable onPress={handleWithdraw}>
          <Text style={styles.deleteUser}>회원 탈퇴</Text>
        </Pressable>
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
  contentbox: {
    backgroundColor: '#fff',
    width: '85%',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  Row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    width: 90,
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginVertical: 10,
  },
  findText: {
    color: '#004E89',
    fontSize: 15,
    fontWeight: '500',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'flex-end',
  },
  deleteUserBox: {
    marginTop: 10,
    marginRight: 10,
    width: '85%',
    alignItems: 'flex-end',
  },
  deleteUser: {
    fontWeight: '800',
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'underline',
  },
});
