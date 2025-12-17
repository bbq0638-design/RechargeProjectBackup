import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
} from 'react-native';

export default function SettingAppInfoScreen({}) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>앱 정보</Text>
            </View>

            <View style={styles.box}>
                <Text style={styles.boxTitle}>개발사</Text>
                <Text style={styles.boxText}>Re:Charger</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.boxTitle}>고객센터</Text>
                <Text style={styles.boxText}>rechargesupport@example.com</Text>
                <Text style={styles.boxText}>02=1111-1111</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.boxTitle}>운영 시간</Text>
                <Text style={styles.boxText}>평일 09:00-18:00</Text>
                <Text style={styles.boxText}>(주말 및 공휴일 휴무)</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.boxTitle}>사업자 정보</Text>
                <Text style={styles.boxText}>상호: Re:Charge</Text>
                <Text style={styles.boxText}>사업자등록번호: 123-45-67890</Text>
                <Text style={styles.boxText}>주소: 천안시 동남구</Text>
            </View>

            <View style={styles.boxBottom}>
                <Text style={styles.boxBottomText}>© 2025 Re:Charge 앱, rights reserved</Text>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        flexDirection: 'column',
        alignItems: 'flex-start',
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
})