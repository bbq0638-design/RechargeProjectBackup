import React, {useState ,useEffect} from 'react';
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import { writeComment, getCommentList, updateComment, deleteComment } from '../../utils/CommentApi';
import CustomTextInput from './TextInput';
import Button from './Button';
import IconButton from './iconButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReportModal from './ReportModal';
import { submitReport } from '../../utils/ReportApi';

function CommentSection({ targetType, targetId, currentUserId }) {
  

  const [comments, setComments] = useState([]); //여러개 map
  const [comment, setComment] = useState(''); //단수
  const [editText, setEditText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 전송 방지

  const [currentUserRole, setCurrentUserRole] = useState('USER');

  const [isReportModalVisible, setReportModalVisible] = useState(false);
  //신고 대상 정보 저장
  const [reportTarget, setReportTarget] = useState({ id: null, userId: null}); 

  // 화면 로드 시 댓글 목록 불러오기
  useEffect(() => {

    const checkRole = async () => {
      const role = await AsyncStorage.getItem('userRole');
      if(role) setCurrentUserRole(role);
      console.log("현재 사용자 권한:", role);
    };
    checkRole();

    if(targetId) {
      fetchComments();
    }
  }, [targetId]);

  const fetchComments = async () => {
    try {
      const data = await getCommentList(targetType, targetId);

      const list = data || [];

      const formatted = list.map(item => ({   //map의 경우 data가 null이면 에러 발생
        id: item.commentId,
        user: item.userId,
        nickname: item.userNickname,
        time: item.createDate,
        text: item.commentText,
        isEditing: false,
      }));
      setComments(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  // 댓글 등록
  const handlePost = async () => {
    console.log('handlePost 호출됨, isSubmitting:', isSubmitting);
    if (!comment.trim()) return;
    if (isSubmitting) {
      console.log('이미 전송 중 - 무시');
      return;
    }
    
    setIsSubmitting(true); // 전송 시작
    console.log('댓글 전송 시작');
    try {
      const payload = {
        targetType: targetType,
        targetId: targetId,
        userId: currentUserId,
        commentText: comment.trim(),
      };

      console.log('API 호출 직전');
      const result = await writeComment(payload);
      console.log('API 호출 완료, 결과:', result);

      if (result === 'SUCCESS') {
        setComment('');
        await fetchComments(); //목록 갱신
      } else {
        Alert.alert('오류', '댓글 등록에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '서버 통신 중 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false); // 전송 완료
    }
  };


  // 댓글 수정 시작
  const handleEdit = id => {
    const target = comments.find(c => c.id === id);
    if(target) {
      setEditText(target.text);
      setComments(comments.map(c => ({...c, isEditing: c.id === id})));
    }
  };

  // 수정 저장
  const handleSaveEdit = async(id) => {
    if (!editText.trim()) {
      Alert.alert("알림","내용을 입력해주세요.");
      return;
    }
    try {
      const payload = {
        commentId: id,
        userId: currentUserId, //qhsdlsdlswmd
        commentText: editText.trim()
      };
    const result = await updateComment(payload);

    if(result === 'SUCCESS') {
      //성공 시 로컬 state 즉시 반영
      setComments(
        comments.map(c =>
          c.id === id? {...c, text: editText, isEditing: false} : c,
        ),
      );
      setEditText('');
      Alert.alert("성공", "댓글이 수정되었습니다.");
    } else {
      Alert.alert("실패", "수정 권한이 없거나 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("수정 중 오류:", error);
      Alert.alert("오류", "수정 중 문제가 발생헀습니다.");
    }
  };

  // 수정 취소
  const handleCancelEdit = id => {
    setComments(
      comments.map(c => (c.id === id ? {...c, isEditing: false} : c)),
    );
    setEditText('');
  };

  // 댓글 삭제
  const handleDelete = id => {
    Alert.alert('삭제', '정말 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async() => {
          try{
            //서버에 삭제 요청
            const result = await deleteComment(id, currentUserId, currentUserRole);

            //성공 시 목록 새로고침
           if (result === 'SUCCESS') {
              Alert.alert("성공", "댓글이 삭제되었습니다.");
               fetchComments(); // DB에서 다시 불러와서 확실하게 지워진 모습 보여주기
            } else {
               Alert.alert("실패", "본인의 댓글만 삭제할 수 있습니다.");
            }
          } catch (error) {
            console.error('삭제 에러:', error);
            Alert.alert("오류", "삭제 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
  };

  // 신고 버튼 클릭
  const handleReportClick = (commentId, targetUserId) => {
    if (String(currentUserId) === String(targetUserId)) {
      Alert.alert('알림', '본인 글은 신고할 수 없습니다.');
      return;
    }
    setReportTarget({ id: commentId, userId: targetUserId });
    setReportModalVisible(true);
  };

  //신고 전송
  const handleReportSubmit = async (reason) => {
    setReportModalVisible(false);

    try {
      const payload = {
        reportTargetType: targetType,
        reportTargetId: reportTarget.id, //state에 저장된 id 사용
        userId: currentUserId,
        reportTargetUserId: reportTarget.userId,
        reportReason: reason
      };

      console.log("신고 요청:", payload);
      const res = await submitReport(payload);

      if (res.status === 'SUCCESS') {
        Alert.alert('완료', '신고가 접수되었습니다.');
      } else if (res.status === 'ALREADY_REPORTED') {
        Alert.alert('알림', '이미 신고하신 댓글입니다.');
      } else {
        Alert.alert('실패', '신고 접수에 실패했습니다.');
      }
    } catch (e) {
      console.error('신고 에러:', e);
      Alert.alert('오류', '통신 중 문제가 발생했습니다.');
    } finally {
      setReportTarget({ id: null, userId: null });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 댓글 */}
      <Text style={styles.commentHead}>댓글</Text>

      {/* 댓글 입력 */}
      <View style={styles.inputRow}>
        <CustomTextInput
          value={comment}
          onChangeText={setComment}
          placeholder="댓글을 입력하세요..."
          height={40}
          multiline
          style={styles.inputWrapper}
          inputStyle={styles.commentInput}
        />

        <Button
          text={isSubmitting ? "..." : "Post"}
          type="submit"
          width={60}
          height={40}
          onPress={handlePost}
          disabled={isSubmitting}
          style={styles.postButton}
        />
      </View>

      {/* ⭐ FlatList → map 렌더링 */}
      {comments.map(item => {
        const isMyComment = (String(item.user) === String(currentUserId));
        const isAdmin = (currentUserRole === 'ADMIN');
        const canDelete = isMyComment || isAdmin;
        const canReport = !isMyComment && !isAdmin;

        return (
          <View key={item.id} style={styles.commentBox}>
            <View style={styles.headerRow}>
              <Text style={styles.username}>{item.nickname || item.user}</Text>
              <Text style={styles.time}>{item.time}</Text>

              <View style={styles.actions}>
                {isMyComment && !item.isEditing ? (
                  <>
                    <IconButton
                      type="commentEdit"
                      size={18}
                      onPress={() => handleEdit(item.id)}
                    />
                    <IconButton
                      type="commentDelete"
                      size={18}
                      color="#cc4a4a"
                      onPress={() => handleDelete(item.id)}
                    />
                  </>
                ) : null}
              {/* 관리자 */}
              {isAdmin && !isMyComment && !item.isEditing? (
                <IconButton
                  type="commentDelete"
                  size={18}
                  color="#cc4a4a"
                  onPress={() => handleDelete(item.id)}
                  />
              ) : null}

                {canReport && !item.isEditing ? (
                  <IconButton
                    type="report"
                    size={18}
                    color="#cc4a4a"
                    onPress={() => handleReportClick(item.id, item.user)}
                  />
                ) : null}
              </View>
            </View>

            {/* 수정 모드 UI */}
            {canDelete && item.isEditing ? (
              <View style={styles.editRow}>
                <CustomTextInput
                  value={editText}
                  onChangeText={setEditText}
                  height={20}
                  style={styles.editInputWrapper}
                  inputStyle={styles.editInput}
                />

                <Button
                  text="취소"
                  type="cancel"
                  width={60}
                  height={35}
                  onPress={() => handleCancelEdit(item.id)}
                  style={styles.editCancel}
                />

                <Button
                  text="저장"
                  type="submit"
                  width={60}
                  height={35}
                  onPress={() => handleSaveEdit(item.id)}
                  style={styles.editSave}
                />
              </View>
            ) : (
              <Text style={styles.commentText}>{item.text}</Text>
            )}
          </View>
        );
      })}
      {/* 신고 모달 배치 */}
      <ReportModal
        isVisible={isReportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReportSubmit}
        />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    
  },

  commentHead: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginTop: 20,
    marginBottom: 20,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },

  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },

  commentInput: {
    height: 40,
    paddingVertical: 10,
  },

  postButton: {
    borderRadius: 10,
    backgroundColor: '#004E89',
  },

  /* 댓글 박스 */
  commentBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  username: {
    fontWeight: '700',
    fontSize: 15,
    color: '#1A1C1E',
  },

  time: {
    marginLeft: 8,
    fontSize: 12,
    color: '#9CA3AF',
  },

  actions: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },

  commentText: {
    marginTop: 10,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

  /* 수정 모드 */
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  editInputWrapper: {
    flex: 1,
    marginRight: 8,
  },

  editInput: {
    height: 35,
    paddingVertical: 8,
    fontSize: 14,
    color: '#374151',
  },

  editCancel: {
    marginRight: 6,
  },

  editSave: {
    backgroundColor: '#004E89',
  },
});

export default CommentSection;