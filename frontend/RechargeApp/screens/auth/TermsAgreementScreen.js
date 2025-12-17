import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Checkbox from '@react-native-community/checkbox';

export default function TermsAgreementScreen({navigation}) {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const handleNext = () => {
    if (!agreeTerms || !agreePrivacy) {
      Alert.alert('필수 약관에 모두 동의해주세요.');
      return;
    }
    navigation.navigate('SignUpScreen');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>약관동의</Text>

      {/* 이용약관 */}
      <View style={styles.box}>
        <Text style={styles.title}>이용 약관</Text>
        <ScrollView style={styles.textArea} nestedScrollEnabled={true}>
          <Text style={styles.text}>
            {`[Recharge] 이용약관

제1조 (목적)
이 약관은 [Recharge]가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "회원"이란 본 약관에 따라 서비스에 가입하여 이용하는 자를 말합니다.
2. "서비스"란 회사가 제공하는 모든 온라인 서비스 및 관련 부가 서비스를 의미합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 회원이 동의함으로써 효력이 발생합니다.
2. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 사전에 공지합니다.

제4조 (회원의 의무)
1. 회원은 서비스 이용 시 관련 법령 및 회사의 정책을 준수해야 합니다.
2. 타인의 정보를 도용하거나 부정한 방법으로 서비스를 이용해서는 안 됩니다.

제5조 (서비스의 제공 및 변경)
1. 회사는 회원에게 안정적인 서비스를 제공하기 위해 노력합니다.
2. 서비스 내용은 회사의 사정에 따라 변경될 수 있으며, 변경 시 사전 공지합니다.

제6조 (계정 관리 및 해지)
1. 회원은 자신의 계정 정보를 안전하게 관리해야 하며, 제3자에게 공유해서는 안 됩니다.
2. 회원은 언제든지 서비스 이용을 중단하고 탈퇴할 수 있습니다.

[전체 약관은 회사 홈페이지 또는 고객센터를 통해 확인하실 수 있습니다.]`}
          </Text>
        </ScrollView>

        <View style={styles.checkRow}>
          <Checkbox
            value={agreeTerms}
            onValueChange={setAgreeTerms}
            tintColors={{true: '#004E89', false: '#9CA3AF'}}
            onCheckColor="#ffffff"
          />
          <Text>[필수] 이용약관에 동의합니다.</Text>
        </View>
      </View>

      {/* 개인정보 수집 동의 */}
      <View style={styles.box}>
        <Text style={styles.title}>개인정보 수집 동의</Text>
        <ScrollView style={styles.textArea} nestedScrollEnabled={true}>
          <Text style={styles.text}>
            {`[서비스명] 개인정보 수집 및 이용 동의서

Recharge는 회원가입 및 서비스 제공을 위해 아래와 같은 개인정보를 수집 및 이용합니다.

1. 수집 항목
- 아이디, 비밀번호, 이름, 전화번호, 이메일, 차종, 성별

2. 수집 목적
- 회원 식별 및 본인 확인
- 서비스 제공 및 맞춤형 콘텐츠 제공
- 공지사항 전달 및 고객 응대

3. 보유 및 이용 기간
- 회원 탈퇴 시까지 또는 관련 법령에 따라 보존 필요 시까지

4. 동의 거부 권리 및 불이익
- 회원은 개인정보 수집 및 이용에 대한 동의를 거부할 수 있습니다.
- 단, 필수 항목에 대한 동의가 없을 경우 회원가입이 제한될 수 있습니다.

본인은 위의 내용을 충분히 이해하였으며, 개인정보 수집 및 이용에 동의합니다.
                    `}
          </Text>
        </ScrollView>

        <View style={styles.checkRow}>
          <Checkbox
            value={agreePrivacy}
            onValueChange={setAgreePrivacy}
            tintColors={{true: '#004E89', false: '#9CA3AF'}}
            onCheckColor="#ffffff"
          />
          <Text>[필수] 개인정보 수집 및 이용에 동의합니다.</Text>
        </View>
      </View>

      {/* 마케팅 선택 동의 */}
      <View style={styles.box}>
        <Text style={styles.title}>마케팅 정보 수신 동의</Text>
        <ScrollView style={styles.textArea} nestedScrollEnabled={true}>
          <Text style={styles.text}>
            {`[서비스명] 마케팅 정보 수신 동의서

Recharge는 회원에게 유익한 정보 제공을 위해 이메일 및 문자 메시지를 통해 이벤트, 혜택, 광고 등의 정보를 발송할 수 있습니다.

1. 수신 항목
- 이메일, 문자 메시지

2. 수신 목적
- 이벤트 및 프로모션 안내
- 신규 서비스 및 혜택 정보 제공

3. 수신 거부
- 회원은 언제든지 마케팅 정보 수신을 거부할 수 있으며, 수신 거부 시에도 서비스 이용에는 제한이 없습니다.

본인은 위의 내용을 충분히 이해하였으며, 마케팅 정보 수신에 동의합니다.
      `}
          </Text>
        </ScrollView>

        <View style={styles.checkRow}>
          <Checkbox
            value={agreeMarketing}
            onValueChange={setAgreeMarketing}
            tintColors={{true: '#004E89', false: '#9CA3AF'}}
            onCheckColor="#ffffff"
          />
          <Text>[선택] 마케팅 정보 수신에 동의합니다.</Text>
        </View>
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>
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
  box: {
    width: '90%',
    marginBottom: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    height: 200,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    elevation: 2,
  },
  text: {
    fontSize: 12,
    color: '#374151',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextBtn: {
    backgroundColor: '#004E89',
    paddingVertical: 13,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  nextText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
