import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import IconButton from '../../components/common/iconButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentSection from '../../components/common/CommentSection';
import { getPostDetail, deletePost, toggleLike } from '../../utils/CommunityApi';
import { API_BASE_URL } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReportModal from '../../components/common/ReportModal';
import { submitReport } from '../../utils/ReportApi';

export default function BoardDetailScreen({ navigation, route }) {
    //목록에서 넘겨준 기본 정보
    const { post, postId } = route.params || {};

    //알림 클릭시 postId우선 목록클릭시 post.id사용
    const effectiveId = postId ? Number(postId) : post?.id;

    //서버에서 받아올 상세 정보
    const [postDetail, setPostDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    const [myId, setMyId] = useState(null);
    const [myRole, setMyRole] = useState(null);

    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] =useState(0);

    const [isReportModalVisible, setReportModalVisible] = useState(false);
    const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());

    useEffect(() => {
        const checkMyInfo = async () => {
            try{
                const id = await AsyncStorage.getItem('userId');
                const role = await AsyncStorage.getItem('userRole');

                if(id) setMyId(id);
                if(role) setMyRole(role);
            } catch (e) {
                console.error("사용자 정보 로드 실패", e);
            }
        };
        checkMyInfo();
    },[]);


    //상세정보 가져오기
    useFocusEffect(
        useCallback(() => {
            if (!effectiveId) {
                Alert.alert("오류", "잘못된 접근입니다.");
                navigation.goBack();
                return;
            }

            const fetchPostDetail = async () => {
                setLoading(true); // 로딩 시작
                try {
                    const storedUserId = await AsyncStorage.getItem('userId');
                    if (storedUserId) setMyId(storedUserId);

                    // 서버 상세 정보 조회
                    console.log(`[BoardDetail] 글 상세 조회 시작: ID=${effectiveId}`);
                    const data = await getPostDetail(effectiveId, storedUserId);
                    
                    console.log('상세 데이터 로드 완료:', data.communityPostId);
                    setPostDetail(data);

                    setImageRefreshKey(Date.now());

                    setIsLiked(data.liked > 0 || data.liked === true);
                    setLikeCount(data.communityLikeCount || 0);

                } catch (error) {
                    console.error("글 상세 로드 실패:", error);
                    Alert.alert('오류', '글 내용을 불러오지 못했습니다.', [
                        { text: '확인', onPress: () => navigation.goBack() }
                    ]);
                } finally {
                    setLoading(false);
                }
            };

            fetchPostDetail();
        }, [effectiveId]) // ID가 변경되면 무조건 실행됨
    );

    const rawData = postDetail || post;

    //화면에 보여줄 데이터 정리
    const displayPost = postDetail ? {
        ...postDetail,
        communityTitle: postDetail.communityTitle || postDetail.title,
        userNickname: postDetail.userNickname || postDetail.userId,
        userId: postDetail.userId,
        createDate: postDetail.createDate,
        communityLikeCount: postDetail.communityLikeCount,
        categoryName: postDetail.categoryName,
        communityContent: postDetail.communityContent,
        communityViewCount: postDetail.communityViewCount,
        // 서버에서 Y라고 했거나 imageUrl이 있으면 true. (post.hasImage는 섞지 않음)
        hasImage: (postDetail.hasImage === 'Y') || (postDetail.imageUrl ? true : false)
    } : {
        // 로딩 중이라 postDetail이 없을 때는 목록에서 가져온 정보(post) 사용
        ...post,
        communityTitle: post?.title,
        userNickname: post?.nickname || post?.userNickname,
        userId: post?.userId,
        createDate: post?.time,
        communityLikeCount: post?.likes || 0,
        categoryName: post?.category,
        communityContent: '',
        communityViewCount: 0,
        hasImage: post?.hasImage === 'Y'
    };

    console.log(`[권한 확인] 글쓴이: ${displayPost.userId} vs 나: ${myId}`);
    console.log(`[권한 결과] 내 글인가? ${String(displayPost.userId) === String(myId)}`);
  

    const isMyPost = myId && displayPost.userId && (String(displayPost.userId) === String(myId));
    const isAdmin = myRole === 'ADMIN';

    
    // 이미지 URL 생성 (api.js 설정을 따름)
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const targetPostId = effectiveId;
    const finalImageUrl = `${cleanBaseUrl}/community/image/${targetPostId}?t=${imageRefreshKey}`;

    const handleLikePress = async () => {
        if (!myId) {
            Alert.alert('알림', '로그인이 필요한 서비스입니다.');
            return;
        }
        const prevLiked = isLiked;
        const prevCount = likeCount;

        try {
            setIsLiked(!prevLiked);
            setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

            //서버 요청
            const result = await toggleLike(effectiveId, myId);

            //서버 응답으로 확실하게 데이터 동기화
            setIsLiked(result.liked);
            setLikeCount(result.count);
        } catch (error) {
            console.error('좋아요 에러:', error);
            Alert.alert('오류', '좋아요 처리에 실패했습니다.');

            setIsLiked(prevLiked);
            setLikeCount(prevCount);
        }
    };

    const handlePostEdit = () => {
        Alert.alert(
            '게시글 수정',
            '이 게시글을 수정하시겠습니까?',
            [
                { text: '취소'},
                { text: '수정',
                    onPress: () => {
                        navigation.navigate('BoardWrite', { editData: displayPost });
                    }
                },
                                ]);
    };

    const handlePostDelete = () => {
        Alert.alert(
            '게시글 삭제',
            '정말로 이 게시글을 삭제하시겠습니까?',
            [
                { text: '취소', style: 'cancel'},
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const res =await deletePost(effectiveId);

                            if (res.status === 200) {
                                Alert.alert('성공', '게시글이 삭제되었습니다.', [
                                    { text: '확인', onPress: ()=> navigation.goBack()}
                                ]);
                            }
                        } catch (error) {
                            console.error('삭제 실퍠:', error);
                            Alert.alert('오류', '게시글 삭제 중 문제가 발생했습니다.');
                        }
                    }
                },
            ]
        );
    };

    const handlePostReport = () => {
        if (isMyPost) {
        Alert.alert('신고', '이 게시글을 신고하시겠습니까?');
        return;
        }
        setReportModalVisible(true);
    };

    const handleReportSubmit = async (reason) => {
        setReportModalVisible(false); //모달 달기

        try {
            const payload = {
                reportTargetType: 'boardpost', //게시글
                reportTargetId: targetPostId, //게시글 아이디
                userId: myId,
                reportTargetUserId: displayPost.userId, //작성자
                reportReason: reason
            };
            
            console.log("게시글 신고 요청:", payload);
            const res = await submitReport(payload);

            if (res.status === 'SUCCESS') {
                Alert.alert('완료', '신고가 정상적으로 접수되었습니다.' );
            } else if (res.status === 'ALREADY_REPORTED') {
                Alert.alert('알림', '이미 신고하신 게시글입니다.');
            } else {
                Alert.alert('실패', '신고 접수에 실패했습니다.');
            }
        } catch (e) {
            console.error('신고 에러:', e);
            Alert.alert('오류', '통신 중 문제가 발생했습니다.');
        }
    };
    

    if (loading && !postDetail) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#004E89"/>
                </View>
            </SafeAreaView>
        );
    }

    return (
         <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* 게시글 헤더 */}
                    <View style={styles.titleRow}>              
                        <View style={styles.titleLeft}>
                            {/* 카테고리 뱃지 */}
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{displayPost.categoryName}</Text>
                            </View>
                        </View>

                            {/* 수정 삭제 신고 */}
                            <View style={styles.iconRow}>
                                {isMyPost ? (
                                    <>
                                        <IconButton type="commentEdit" size={20} color="#555" onPress={handlePostEdit} style={styles.actionIcon}/>
                                        <IconButton type="commentDelete" size={20} color="#555" onPress={handlePostDelete} style={styles.actionIcon}/>
                                    </>
                                ) : isAdmin? (
                                    <IconButton type="commentDelete" size={20} color="#555" onPress={handlePostDelete} style={styles.actionIcon}/>
                                ) : (
                                   <IconButton type="report" size={20} color="#cc4a4a" onPress={handlePostReport} style={styles.actionIcon}/>
                                )}
                            </View>
                    </View>
                    <Text style={styles.title}>{displayPost.communityTitle}</Text>
                    {/* 메타 정보 */}
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>
                            by {displayPost.userNickname} · {displayPost.createDate}
                        </Text>
                        
                        <View style={styles.statsContainer}>
                            {/* 좋아요*/}
                            <View style={styles.statsItem}>
                                <MaterialCommunityIcons
                                    name={isLiked ? "heart" : "heart-outline"} 
                                    size={18}
                                        color={isLiked? "#F87171" : "#6B7280"} 
                                        onPress={handleLikePress}/>
                                <Text style={styles.statsText}>{likeCount}</Text>
                            </View>

                            {/* 조회수 */}
                            <View style={styles.statsItem}>
                                <Text style={styles.statsText}>조회수 {displayPost.communityViewCount}</Text>
                            </View>
                        </View>
                    </View>  
         
                    {/* 본문 */}
                    <View style={styles.contentCard}>
                        {displayPost.hasImage && (
                            <Image source={{ uri: finalImageUrl }}
                                style={styles.postImage}
                                resizeMode="cover"
                                onError={(e) => console.log("이미지 로드 에러:", e.nativeEvent.error)}
                            />
                        )}
                        <Text style={styles.content}>{displayPost.communityContent}</Text>
                    </View>
                    
                    <View/>

                    {/* 댓글 영역 */}
                    <View style={styles.commentSectionWrapper}>
                        <CommentSection
                        targetType="boardcomment"          
                        targetId={targetPostId} // 중요: 게시글의 고유 ID (PK)
                        currentUserId={myId}            // 로그인한 사용자 ID (AsyncStorage에서 가져온 값)
                        />
                    </View>                    
                </ScrollView>
            </KeyboardAvoidingView>

            <ReportModal
                isVisible={isReportModalVisible}
                onClose={() => setReportModalVisible(false)}
                onSubmit={handleReportSubmit}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 4,
    },
    titleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
       
    },
    categoryBadge: {
        backgroundColor: '#004E89',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 0,
        marginRight: 8,
    },
    categoryText: {
        color: '#F9FAFB',
        fontWeight: '600',   
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    actionIcon: {
        marginLeft: 4,
        padding: 4,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 0,
        lineHeight: 26,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,

    },
    metaText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
    },
    statsItem: { 
      flexDirection: "row", 
      alignItems: "center",
      marginLeft: 6,
  },
    statsText: { 
         marginLeft: 4,
         fontSize: 13,
         color: '#6B7280',
         fontWeight: '500',
    },
    contentCard: {
        //backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 12,
        marginBottom: 10,
    //    borderWidth: 1,
    //     borderColor: "#dcdcdcff",
    //     shadowColor: '#000',
    //     shadowOffset: {
    //         width: 0,
    //         height: 2,
    //     },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //     elevation: 3,
     },
    postImage: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        marginBottom: 16,
    },
    content: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 24,
    },
    commentSectionWrapper: {
        marginTop: -10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },    
});