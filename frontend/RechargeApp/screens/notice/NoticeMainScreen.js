import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoticeItem from "../../components/notice/NoticeItem";
import { getNotices } from "../../utils/NoticeApi";
import Button from "../../components/common/Button";
import { useFocusEffect } from '@react-navigation/native';


export default function NoticeMainScreen({ navigation, route }) {
    const [user, setUser] = useState(route.params?.user || null);
    const [noticeList, setNoticeList] = useState([]);
    const [loading, setLoading] = useState(true);

    // user 정보 가져오기
    useEffect(() => {
        const loadUser = async () => {
            if (!user) {
                const userId = await AsyncStorage.getItem('userId');
                const role = await AsyncStorage.getItem('userRole') || 'USER';
                setUser({ userId, role });
            }
        };
        loadUser();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const noticeArray = await getNotices();
            setNoticeList(noticeArray);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotices();
        }, [])
    );

    const renderItem = ({ item }) => (
        <NoticeItem
            item={{
                id: item.id,
                title: item.title,
                date: item.createDate,
                views: item.viewCount,
                createId: item.createId
            }}
            onPress={() =>
                navigation.navigate("NoticeDetail", {
                    noticeList,
                    noticeId: item.id,
                    isAdmin: user?.role === "ADMIN",
                    user
                })
            }
        />
    );

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

  return (
        <View style={styles.container}>
            {/* 상단 헤더 */}
            <View style={styles.header}>
                <View style={styles.headerLogo}>
                    <MaterialCommunityIcons name="bell-outline" size={30} color="#004E89" />
                    <Text style={styles.headerTitle}>공지사항</Text>
                </View>

               
                {user?.role === "ADMIN" && (
                    <Button
                        type="add"
                        text="+  글쓰기"
                        width={80}
                        height={34}
                        textStyle={{ fontSize: 13, fontWeight: '600' }}
                        onPress={() => navigation.navigate('NoticeWrite', {
                            noticeList,
                            mode: "create",
                            isAdmin: true,
                            user,
                        })}
                    />
                )}
            </View>
            <FlatList
                data={noticeList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 0 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    header: {
        justifyContent: 'space-between',
        marginTop: 16,
        height: 60,
        flexDirection: "row",
        paddingHorizontal: 20,

    },

    headerLogo: { flexDirection: "row" },
    headerTitle: { paddingLeft: 6, fontSize: 22, fontWeight: "bold", color: "black" },
    cardContent: { flex: 1 },
    title: { fontSize: 15, color: "black", fontWeight: "600", marginBottom: 4 },
    date: { fontSize: 13, color: "#777" },

});
