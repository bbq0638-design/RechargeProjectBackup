import React from "react";
import { View, FlatList, Text, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ReportItem from "../../components/admin/ReportItem";
import { updateReportStatus } from "../../utils/ReportApi";

export default function ReportAllScreen({ user, filterType, allReports, onRefresh }) {

    const navigation = useNavigation();

    // 1. 필터링 로직 (부모가 준 전체 데이터에서 거르기)
    const getFilteredReports = () => {
        if (!allReports) return [];

        if (!filterType || filterType === 'ALL') {
            return allReports;
        }
        return allReports.filter(item => item.reportTargetType === filterType);
    };

    const filteredData = getFilteredReports();

    // 2. 상세 이동 로직 (작성해주신 완벽한 코드 반영)
    const handlePressDetail = (report) => {
        const type = report.reportTargetType;
        const targetId = report.reportTargetId;

        // A. 실제 이동해야 할 게시글 ID(PK) 추출
        // 게시글 신고면 targetId가 곧 글번호, 댓글 신고면 postId가 부모 글번호
        let realId;
        if (type.endsWith('post')) {
            realId = targetId;
        } else {
            realId = report.postId;
        }

        // B. ID가 없으면 중단 (에러 방지)
        if (!realId) {
            Alert.alert("오류", "이동할 게시글 정보를 찾을 수 없습니다.");
            return;
        }

        let screenName = "";
        let params = {};

        // C. 타입별로 화면 이름과 파라미터 이름(Key)을 다르게 설정 (다 넣어주기 전략)
        if (type.includes("movie")) {
            screenName = "MovieDetail";
            params = {
                moviePostId: realId,
                movieId: realId,
                type: 'post',   // 혹시 몰라 다 넣어줌
                postId: realId,
                post: { moviePostId: realId, id: realId } // post 객체 내부도 맞춰줌
            };

        } else if (type.includes("music")) {
            screenName = "MusicDetail";
            params = {
                musicPostId: realId,
                postId: realId,
                post: { musicPostId: realId, id: realId }
            };

        } else if (type.includes("board") || type.includes("community")) {
            screenName = "BoardDetail";
            // 자유게시판은 보통 postId나 communityPostId 사용
            params = {
                postId: realId,
                communityPostId: realId,
                post: { communityPostId: realId, id: realId }
            };
        }

        if (!screenName) return;

        // D. 댓글 신고인 경우 스크롤 위치 추가
        if (type.endsWith("comment")) {
            params.scrollToCommentId = targetId;
        }

        console.log(`[Admin] 이동: ${screenName}, ID: ${realId}`); // 디버깅용 로그

        // E. 네비게이션 이동
        navigation.navigate(screenName, params);
    };

    // 3. 상태 변경 로직
    const handleChangeStatus = async (reportId, newStatus) => {
        try {
            if (!user || !user.userId) {
                Alert.alert("오류", "관리자 정보가 없습니다.");
                return;
            }
            const adminId = user.userId;

            await updateReportStatus(reportId, newStatus, adminId);

            Alert.alert("성공", "처리 상태가 변경되었습니다.");

            // 상태가 바뀌었으니 부모에게 "데이터 다시 불러와!"라고 요청
            if (onRefresh) {
                onRefresh();
            }

        } catch (error) {
            console.error(error);
            Alert.alert("오류", "상태 변경 실패");
        }
    };

    if (filteredData.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.noDataText}>
                    {filterType === 'ALL'
                        ? "신고된 내역이 없습니다."
                        : "해당 카테고리의 신고 내역이 없습니다."}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.reportId.toString()}
                renderItem={({ item }) => (
                    <ReportItem
                        report={item}
                        onPressDetail={() => handlePressDetail(item)}
                        onChangeStatus={handleChangeStatus}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 10,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 16,
        color: '#888',
    }
});
