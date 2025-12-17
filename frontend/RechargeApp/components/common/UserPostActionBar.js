import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function UserPostActionBar({
  isMine = false,
  isAdmin = false,
  onEdit,
  onDelete,
  onReport,
  style,
}) {
  console.log('UserPostActionBar flags:', {isMine, isAdmin});
  console.log('UserPostActionBar handlers:', {
    onEdit: !!onEdit,
    onDelete: !!onDelete,
    onReport: !!onReport,
  });
  return (
    <View style={[styles.container, style]}>
      {/* 내가 쓴 게시글의 경우 수정/삭제 */}
      {isMine && (
        <>
          <TouchableOpacity
            TouchableOpacity
            onPress={onEdit}
            style={styles.btn}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={22}
              color="#333"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={styles.btn}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </>
      )}

      {/* 관리자의 경우 삭제 */}
      {!isMine && isAdmin && (
        <TouchableOpacity onPress={onDelete} style={styles.btn}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={22}
            color="#333"
          />
        </TouchableOpacity>
      )}

      {/* 타 이용자 게시글의 경우 신고 */}
      {!isMine && !isAdmin && (
        <TouchableOpacity onPress={onReport} style={styles.btn}>
          <MaterialCommunityIcons
            name="alarm-light-outline"
            size={22}
            color="#333"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    marginLeft: 10,
  },
});

export default UserPostActionBar;
