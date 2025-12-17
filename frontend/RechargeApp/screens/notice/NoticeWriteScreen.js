import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, SafeAreaView,
    TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomTextInput from '../../components/common/TextInput';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';
import { insertNotice, editNotice, getNotices } from '../../utils/NoticeApi';

export default function NoticeWriteScreen({ navigation, route }) {
    const { mode = "create", notice = null, noticeList, user } = route.params || {};

    const [title, setTitle] = useState(notice ? notice.noticeTitle : '');
    const [content, setContent] = useState(notice ? notice.noticeContent : '');


    const handleSubmit = async () => {
        try {
            if (mode === "create") {
                const res = await insertNotice({
                    noticeTitle: title,
                    noticeContent: content,
                    userId: user.userId,
                    createId: user.userId,
                    updatedId: user.userId
                });

                const newlyCreateId = res.data.noticeId; // 백엔드가 반환
                alert("공지사항이 등록되었습니다.");
                //최신리스트받아오기

                const updatedNoticeList = await getNotices();
                navigation.push("NoticeDetail", {
                    noticeId: newlyCreateId,
                    noticeList: updatedNoticeList,
                    user,
                    isAdmin: user.role === "ADMIN"

                });
            } else if (mode === "edit") {

                // ========= BEFORE LOG =========
                console.log("=== BEFORE EDIT PARAMS ===");
                console.log({
                    noticeId: notice?.noticeId,
                    noticeTitle: title,
                    noticeContent: content,
                    updatedId: user.userId
                });

                await editNotice({
                    noticeId: notice.noticeId,
                    noticeTitle: title,
                    noticeContent: content,
                    updatedId: user.userId
                });

                // ========= AFTER LOG =========
                console.log("=== AFTER EDIT PARAMS ===");
                console.log({
                    noticeId: notice?.noticeId,
                    noticeTitle: title,
                    noticeContent: content,
                    updatedId: user.userId
                });
                alert("공지사항이 수정되었습니다.");

                navigation.push("NoticeDetail", {
                    noticeId: notice.noticeId,
                    user,
                    noticeList: await getNotices(),
                    isAdmin: user.role === "ADMIN"

                });
            }
        } catch (err) {
            console.error(err);
            alert("오류가 발생했습니다.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.section}>
                        <Text style={styles.label}>제목</Text>
                        <CustomTextInput
                            placeholder="제목을 입력하세요..."
                            value={title}

                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>내용</Text>
                        <TextArea
                            placeholder="내용을 입력하세요..."
                            value={content}
                            onChangeText={setContent}
                            maxLength={1000}
                            style={styles.textArea}
                            autoGrow={false}
                        />

                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        type="submit"
                        text={mode === "create" ? "등록하기" : "수정하기"}
                        width="48%"
                        onPress={handleSubmit}
                        textStyle={{ fontSize: 14 }}
                    />
                    <Button
                        type="cancel"
                        text="취소하기"
                        width="48%"
                        onPress={() => navigation?.goBack()}
                        textStyle={{ fontSize: 14 }}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 6,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 4,
    },
    textArea: {
        height: 270,
        textAlignVertical: 'top',
    },
    attachButtonContainer: {
        marginBottom: 8,
        alignItems: 'flex-end',

    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#F9FAFB',
    },
});