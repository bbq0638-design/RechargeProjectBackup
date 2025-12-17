import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, Alert } from "react-native";

import NoticeInfo from "../../components/notice/NoticeInfo";
import NoticeContent from "../../components/notice/NoticeContent";
import NoticeNav from "../../components/notice/NoticeNav";
import { incrementNoticeViewCount, getNoticeDetail, deleteNotice } from "../../utils/NoticeApi";

export default function NoticeDetail({ route, navigation }) {
    const { noticeId, noticeList, isAdmin, user } = route.params; // 전체 리스트, 선택 ID, 관리자 여부, 유저
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotice = async () => {
            try {

                await incrementNoticeViewCount(noticeId);

                const data = await getNoticeDetail(noticeId);
                setNotice(data);
            } catch (err) {
                console.error(err);
                Alert.alert("오류", "공지사항을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchNotice();
    }, [noticeId]);

    if (loading || !notice) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    // 현재 공지 위치
    const currentIndex = noticeList?.findIndex(n => n.id === noticeId) ?? -1;
    const prevNotice = currentIndex > 0 ? noticeList[currentIndex - 1] : null;
    const nextNotice = currentIndex >= 0 && currentIndex < noticeList.length - 1 ? noticeList[currentIndex + 1] : null;
    // 삭제 핸들러
    const handleDelete = async (id) => {
        try {
            await deleteNotice(id);
            Alert.alert("삭제 완료", "공지사항이 삭제되었습니다.");
            navigation.popToTop(); // 목록으로 돌아가기
        } catch (err) {
            console.error(err);
            Alert.alert("오류", "삭제에 실패했습니다.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* 공지 정보 */}
                <NoticeInfo
                    notice={notice}
                    isAdmin={isAdmin}
                    onEdit={() =>
                        navigation.navigate("NoticeWrite", {
                            notice,
                            noticeList,
                            mode: "edit",
                            user
                        })
                    }
                    onDelete={() => handleDelete(notice.noticeId)}
                />

                {/* 공지 내용 */}
                <NoticeContent content={notice.noticeContent} />

                {/* 이전 / 다음 네비 */}
                <NoticeNav
                    prevTitle={prevNotice?.title || "없음"}
                    nextTitle={nextNotice?.title || "없음"}
                    onPrev={() => {
                        if (prevNotice) {
                            navigation.push("NoticeDetail", {
                                noticeId: prevNotice.id,
                                noticeList,
                                isAdmin,
                                user
                            });
                        }
                    }}
                    onNext={() => {
                        if (nextNotice) {
                            navigation.push("NoticeDetail", {
                                noticeId: nextNotice.id,
                                noticeList,
                                isAdmin,
                                user
                            });
                        }
                    }}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    contentContainer: { padding: 16, paddingBottom: 32 },
});
