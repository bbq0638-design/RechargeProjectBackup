import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';
import IconButton from '../../components/common/iconButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingLocationScreen () {
    
    const openLocationSettings = () => {
        Alert.alert(
            "권한 설정 이동",
            "위치 권한을 변경하기 위해 휴대폰 설정 화면으로 이동합니다.",
            [
                {text: "취소", style: "cancel"},
                {text: "이동", onPress: () => Linking.openSettings() }
            ]
        );
    };

    const openNotificationSettings = () => {
        Alert.alert(
            "권한 설정 이동",
            "알림 권한을 변경하기 위해 휴대폰 설정 화면으로 이동합니다.",
            [
                {text: "취소", style: "cancel"},
                {text: "이동", onPress: () => Linking.openSettings() }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>권한 설정</Text>
                </View>

                <TouchableOpacity style={styles.menuItem} onPress={openLocationSettings}>
                   <View style={styles.textContainer}>
                        <Text style={styles.menuText}>위치 권한 설정 변경하기</Text>
                        <Text style={styles.menuSubText}>내 주변 충전소 검색을 이용하기 위해선 '위치 권한'을 허용해주세요.</Text>
                    </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#555555ff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={openNotificationSettings}>
                   <View style={styles.textContainer}>
                        <Text style={styles.menuText}>알림 권한 설정 변경하기</Text>
                        <Text style={styles.menuSubText}>새 소식과 반응 알림을 받기 위해선 '알림 권한'을 허용해주세요.</Text>
                    </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#555555ff" />
                </TouchableOpacity>
            
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
    menuItem: {
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        height: 100,
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
     textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 10,
     },
    menuText: {
        fontSize: 16,
        color: '#374151',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    menuSubText: {
        fontSize: 13,
        color: '#888',
        lineHeight: 18, // 줄 간격
    },

});