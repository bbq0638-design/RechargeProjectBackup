import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 앱 테마 컬러 (BottomNavigation과 통일)
const COLORS = {
    primary: '#004E89',
    secondary: '#E5E7EB',
    textDark: '#1F2937',
    textGray: '#6B7280',
    background: '#F9FAFB',
    white: '#FFFFFF',
    danger: '#EF4444',
    success: '#10B981',
};

// 🚨 [신규 함수] 현재 상태 표시 뱃지의 색상
const getStatusBadgeColor = (status) => {
    // DB에서 가져온 상태값과 일치하는 색상 반환
    if (status === '삭제처리완료') return { backgroundColor: COLORS.danger, borderColor: COLORS.danger };
    if (status === '이상없음처리') return { backgroundColor: COLORS.success, borderColor: COLORS.success };
    if (status === '대기중') return { backgroundColor: COLORS.primary, borderColor: COLORS.primary };
    // 기본값 (정보 없음)
    return { backgroundColor: COLORS.textGray, borderColor: COLORS.textGray };
};


export default function ReportItem({ report, onPressDetail, onChangeStatus }) {


    const handleStatusChange = (newStatus) => {
        // ReportCommentsScreen.js나 ReportPostsScreen.js의 handleChangeStatus 호출
        onChangeStatus(report.reportId, newStatus);
    };

    // 날짜 포맷팅 안전장치
    const dateStr = report.reportDate ? report.reportDate.split('T')[0] : '날짜없음';

    // 현재 처리 상태 (공백 제거 후 사용)
    let currentStatus = report.reportStatus?.trim() || '정보 없음';
    if (currentStatus.toLowerCase() === 'pending') {
        currentStatus = '대기중';
    }

    return (
        <View style={styles.card}>
            {/* 상단 헤더: 날짜 & 배지 */}
            <View style={styles.header}>
                <View style={styles.dateContainer}>
                    <MaterialCommunityIcons name="calendar-clock" size={14} color={COLORS.textGray} />
                    <Text style={styles.dateText}>{dateStr}</Text>
                </View>
                <View style={[styles.badge, getBadgeStyle(report.reportTargetType)]}>
                    <Text style={[styles.badgeText, getBadgeTextStyle(report.reportTargetType)]}>
                        {report.reportTargetType}
                    </Text>
                </View>
            </View>

            {/* 메인 컨텐츠 (클릭 시 상세 이동) */}
            <TouchableOpacity onPress={onPressDetail} activeOpacity={0.7} style={styles.contentContainer}>

                {/* 1. 신고 내용 미리보기 박스 */}
                <View style={styles.previewBox}>
                    <View style={styles.previewHeader}>
                        <MaterialCommunityIcons name="comment-quote-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.previewLabel}>신고 내용 미리보기</Text>
                    </View>
                    <Text style={styles.previewText} numberOfLines={2}>
                        {report.postTitleOrCommentText || "내용을 불러올 수 없거나 삭제된 글입니다."}
                    </Text>
                </View>

                {/* 2. 신고자 -> 대상자 정보 */}
                <View style={styles.infoRow}>
                    <View style={styles.userBox}>
                        <Text style={styles.userLabel}>신고</Text>
                        {/* 🚨 [수정] userLabel에 marginRight을 적용하여 간격 확보 */}
                        <Text style={styles.userText}>{report.userId}</Text>
                    </View>

                    <MaterialCommunityIcons name="arrow-right-thin" size={20} color={COLORS.textGray} />

                    <View style={styles.userBox}>
                        <Text style={styles.userLabel}>대상</Text>
                        {/* 🚨 [수정] userLabel에 marginRight을 적용하여 간격 확보 */}
                        <Text style={styles.userText}>{report.reportTargetUserId || "알수없음"}</Text>
                    </View>
                </View>

                {/* 3. 신고 사유 */}
                <View style={styles.reasonBox}>
                    <Text style={styles.reasonLabel}>사유:</Text>
                    <Text style={styles.reasonText} numberOfLines={1}>{report.reportReason}</Text>
                </View>
            </TouchableOpacity>

            {/* 🚨 [추가] 현재 처리 상태 표시 (사유 밑) */}
            <View style={styles.statusInfoRow}>
                <Text style={styles.statusInfoLabel}>현재 처리 상태:</Text>
                <View style={[styles.currentStatusBadge, getStatusBadgeColor(currentStatus)]}>
                    <Text style={styles.currentStatusText}>
                        {currentStatus}
                    </Text>
                </View>
            </View>


            {/* 하단: 상태 변경 버튼 그룹 */}
            <View style={styles.footer}>
                <StatusButton
                    currentStatus={currentStatus} // trim된 상태값을 전달
                    targetStatus="삭제처리완료"
                    label="삭제"
                    color={COLORS.danger}
                    onPress={handleStatusChange}
                />
                <StatusButton
                    currentStatus={currentStatus} // trim된 상태값을 전달
                    targetStatus="대기중"
                    label="대기"
                    color={COLORS.textGray}
                    onPress={handleStatusChange}
                />
                <StatusButton
                    currentStatus={currentStatus} // trim된 상태값을 전달
                    targetStatus="이상없음처리"
                    label="이상없음"
                    color={COLORS.success}
                    onPress={handleStatusChange}
                />
            </View>
        </View>
    );
}

// 상태 버튼 컴포넌트
const StatusButton = ({ currentStatus, targetStatus, label, color, onPress }) => {
    // DB의 공백이나 줄바꿈 제거 후 비교
    const isActive = currentStatus === targetStatus; // 이미 위에서 trim 했으므로 바로 비교

    // 활성화되었을 때의 스타일
    const activeStyle = {
        backgroundColor: isActive ? color : '#F3F4F6',
        borderColor: isActive ? color : '#E5E7EB',
    };
    const activeTextStyle = {
        color: isActive ? '#FFFFFF' : '#6B7280',
        fontWeight: isActive ? '700' : '500',
    };

    return (
        <TouchableOpacity
            style={[styles.statusButton, activeStyle]}
            onPress={() => onPress(targetStatus)}
        >
            <Text style={[styles.statusButtonText, activeTextStyle]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

// 배지 스타일 함수
const getBadgeStyle = (type) => {
    if (type?.includes('movie')) return { backgroundColor: '#E0F2FE' }; // 연한 파랑
    if (type?.includes('music')) return { backgroundColor: '#FCE7F3' }; // 연한 분홍
    if (type?.includes('board')) return { backgroundColor: '#DCFCE7' }; // 연한 초록
    return { backgroundColor: '#F3F4F6' }; // 회색
};

const getBadgeTextStyle = (type) => {
    if (type?.includes('movie')) return { color: '#0284C7' };
    if (type?.includes('music')) return { color: '#DB2777' };
    if (type?.includes('board')) return { color: '#16A34A' };
    return { color: '#4B5563' };
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 12,
        color: COLORS.textGray,
        marginLeft: 4,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    contentContainer: {
        marginBottom: 12, // 상태 뱃지 추가로 간격 조정
    },
    previewBox: {
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
        marginBottom: 12,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 6,
    },
    previewLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
    },
    previewText: {
        fontSize: 13,
        color: COLORS.textDark,
        lineHeight: 18,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    userBox: {
        flexDirection: 'row',
        alignItems: 'center',
        // 🚨 [수정] gap 대신 userLabel의 marginRight을 사용해 명확히 띄워줍니다.
        // gap: 6,
    },
    userLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '600',
        marginRight: 8, // 🚨 [수정] 라벨과 ID 사이 간격 (사용자가 요청한 띄어쓰기 2칸 느낌)
    },
    userText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    reasonBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        paddingHorizontal: 4,
        marginBottom: 12, // 🚨 [추가] 다음 상태 정보와의 간격 확보
    },
    reasonLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textGray,
        marginRight: 6,
    },
    reasonText: {
        fontSize: 12,
        color: COLORS.textDark,
        flex: 1,
    },
    // 🚨 [신규 스타일] 현재 처리 상태 표시 영역
    statusInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // 오른쪽 정렬
        marginBottom: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    statusInfoLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textDark,
        marginRight: 8,
    },
    currentStatusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    currentStatusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    footer: {
        flexDirection: 'row',
        gap: 8,
        // statusInfoRow에서 이미 borderTop을 처리했으므로 제거
        // paddingTop: 12, // statusInfoRow 아래이므로 따로 필요 없음
    },
    statusButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    statusButtonText: {
        fontSize: 12,
    },
});
