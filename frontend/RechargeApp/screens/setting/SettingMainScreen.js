import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import IconButton from '../../components/common/iconButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingMainScreen ({ navigation }) {
    
    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>설정하기</Text>
                </View>
                <TouchableOpacity style={styles.menuItem}
                    onPress={() => navigation.navigate('ModifyProfile')}>
                     <MaterialCommunityIcons name="pencil-box-outline" size={24} color="#004E89"/>
                    <Text style={styles.menuText}>   프로필 수정</Text>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#555555ff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}
                    onPress={() => navigation.navigate('SettingLocation')}>
                    <MaterialCommunityIcons name="tune-vertical" size={24} color="#004E89"/>
                    <Text style={styles.menuText}>  권한 설정</Text>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#555555ff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}
                    onPress={() => navigation.navigate('SettingPrivacy')}>
                    <MaterialCommunityIcons name="shield-lock-outline" size={24} color="#004E89"/>
                    <Text style={styles.menuText}>  개인정보 처리방침</Text>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#555555ff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('SettingAppInfo')}>
                    <MaterialCommunityIcons name="information-outline" size={24} color="#004E89"/>
                    <Text style={styles.menuText}>  앱 정보</Text>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#555555ff" />
                </TouchableOpacity>

                <View style={styles.versionContinaer}>
                    <Text style={styles.versionText}>Ver 1.0.0</Text>
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
    menuItem: {
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        height: 70,
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
    menuText: {
        fontSize: 20,
        color: '#374151',
        fontWeight: 'bold',
        flex: 1,          // 1. 남은 공간을 모두 차지해서 화살표를 오른쪽으로 밈
    },
    versionContinaer: {
        marginTop: -10,
        marginLeft: 2,
    },
    versionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9c9c9cff',
    },
});