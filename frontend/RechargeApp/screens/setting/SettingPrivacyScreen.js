import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
} from 'react-native';

export default function SettingPrivateScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>개인정보 처리방침</Text>
            </View>

            <View style={styles.box}>
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20}}>
                    {/* 1. 개인정보 처리방침 (가장 중요하므로 위로 배치) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. 개인정보 수집 및 이용 동의</Text>
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            Re:Charge 개인정보 수집 및 이용 동의서{'\n\n'}
                            회사는 회원가입 및 서비스 제공을 위해 아래와 같은 개인정보를 수집 및 이용합니다.{'\n\n'}
                            1. 수집 항목{'\n'}
                            - 아이디, 비밀번호, 이름, 전화번호, 이메일, 차종, 성별{'\n\n'}
                            2. 수집 목적{'\n'}
                            - 회원 식별 및 본인 확인{'\n'}
                            - 서비스 제공 및 맞춤형 콘텐츠 제공{'\n'}
                            - 공지사항 전달 및 고객 응대{'\n\n'}
                            3. 보유 및 이용 기간{'\n'}
                            - 회원 탈퇴 시까지 또는 관련 법령에 따라 보존 필요 시까지{'\n\n'}
                            4. 동의 거부 권리 및 불이익{'\n'}
                            - 회원은 개인정보 수집 및 이용에 대한 동의를 거부할 수 있습니다.{'\n'}
                            - 단, 필수 항목에 대한 동의가 없을 경우 회원가입이 제한될 수 있습니다.
                        </Text>
                    </View>
                </View>

                {/* 2. 이용 약관 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. 서비스 이용 약관</Text>
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            Re:Charge 이용약관{'\n\n'}
                            제1조 (목적){'\n'}
                            이 약관은 Re:Charge가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.{'\n\n'}
                            제2조 (정의){'\n'}
                            1. "회원"이란 본 약관에 따라 서비스에 가입하여 이용하는 자를 말합니다.{'\n'}
                            2. "서비스"란 회사가 제공하는 모든 온라인 서비스 및 관련 부가 서비스를 의미합니다.{'\n\n'}
                            제3조 (약관의 효력 및 변경){'\n'}
                            1. 본 약관은 회원이 동의함으로써 효력이 발생합니다.{'\n'}
                            2. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 사전에 공지합니다.{'\n\n'}
                            제4조 (회원의 의무){'\n'}
                            1. 회원은 서비스 이용 시 관련 법령 및 회사의 정책을 준수해야 합니다.{'\n'}
                            2. 타인의 정보를 도용하거나 부정한 방법으로 서비스를 이용해서는 안 됩니다.{'\n\n'}
                            제5조 (계정 관리 및 해지){'\n'}
                            1. 회원은 자신의 계정 정보를 안전하게 관리해야 하며, 제3자에게 공유해서는 안 됩니다.{'\n'}
                            2. 회원은 언제든지 서비스 이용을 중단하고 탈퇴할 수 있습니다.
                        </Text>
                    </View>
                </View>

                {/* 3. 마케팅 정보 수신 (선택사항이지만 정보 제공 차원에서 표시) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. 마케팅 정보 수신 동의 (선택)</Text>
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            Re:Charge 마케팅 정보 수신 동의서{'\n\n'}
                            회사는 회원에게 유익한 정보 제공을 위해 이메일 및 문자 메시지를 통해 이벤트, 혜택, 광고 등의 정보를 발송할 수 있습니다.{'\n\n'}
                            1. 수신 항목 : 이메일, 문자 메시지{'\n'}
                            2. 수신 목적 : 이벤트, 프로모션, 신규 혜택 안내{'\n'}
                            3. 수신 거부 : 회원은 언제든지 수신을 거부할 수 있습니다.
                        </Text>
                    </View>
                </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 18,
    },
    title: {
        marginTop: 0,
        marginBottom: 20,
        

    },
    titleText: {
        fontSize: 25,
        fontWeight: '600',
        color: '#000',
    },
    box: {
        padding: 20,
        height: 440,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
     },
         boxTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 3,
    },
    boxBottom: {
        marginTop: -10,
        marginLeft: 2,
    },
    boxBottomText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#a3a1a1ff',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginLeft: 4,
    },
})