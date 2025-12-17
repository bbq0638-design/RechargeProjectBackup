import React, {useState, useRef, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../common/Button';
import IconButton from '../common/iconButton';
import DropdownModalKSA from '../common/DropdownModalKSA';
import messaging from '@react-native-firebase/messaging';
import { getNotifications, readNotification } from '../../utils/NotificationApi';
import { BottomTabBarHeightCallbackContext } from '@react-navigation/bottom-tabs';


export default function Header({navigation}) {
  // navigation.canGoBack()은 무조건 안전 (Navigator가 props로 넘기기 때문)
  const canGoBack = navigation.canGoBack();
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [isNotVisible, setIsNotiVisible] = useState(false);
  const [dropDownPosition, setDropdownPosition] = useState({top: 0, left: 0});

  const alarmIconRef = useRef(null);

const fetchNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      // ★여기서 userId가 null이면 로그인이 제대로 안 된 것
      console.log('[Header] 알림 조회 시도. 로그인된 ID:', userId);

      if (!userId) {
          console.log('[Header] userId가 없어서 알림 조회를 중단합니다.');
          return;
      }

      //notificationApi.js함수 호출
      const list = await getNotifications(userId);
      console.log(`[Header] 받아온 알림 개수: ${list.length}`);

      setNotifications(list);
      //안 읽은 알림(N)이 하나라도 있으면 true
      const unreadExists = list.some(noti => noti.isRead === 'N');
      setHasUnread(unreadExists);
    } catch (error) {
      console.log('알림 로딩 에러(헤더):', error);
    }
  };

    useFocusEffect(
      useCallback(() => {
        fetchNotifications();
      },[])
    );

    useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('[Header] 알림 도착! 목록 갱신합니다.');
      await fetchNotifications(); // 알림 오면 목록 새로고침
    });

    return unsubscribe;
  }, []);

    //알림 아이콘 클릭
  const handleAlarmClick = () => {
    fetchNotifications(); //클릭 시 최신화
    if (alarmIconRef.current) {
      alarmIconRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({
          top: py - 5,
          left: px - 200 + width,
        });
        setIsNotiVisible(true);
      });
    }
  };

  const handleNotificationSelect = async (item) => {
    if (!item || !item.value) return;

    const noti = item.value;

    console.log('====================================');
    console.log('클릭한 알림의 타입(targetType):', noti.targetType);
    console.log('클릭한 알림의 ID(targetId):', noti.targetId);
    console.log('====================================');

    try {
      //읽음 처리
      if (noti.isRead === 'N') {
        await readNotification(noti.notiId);
        fetchNotifications();
      }

      const targetIdNum = Number(noti.targetId);

      //네비게이션 스택 이름이 실제 앱과 일치해야함
      switch (noti.targetType) {
        
        // 자유게시판 (게시글, 댓글, 좋아요)
        case 'boardpost':
        case 'boardcomment': 
        case 'boardlike':
          navigation.navigate('Board', { screen: 'BoardMain' });
          setTimeout(() => {
            navigation.navigate('Board', {
              screen: 'BoardDetail',
              params: {postId: targetIdNum}
            });
          }, 50);
          break;

        // 영화 추천 (게시글, 댓글)
        case 'moviepost':
        case 'moviecomment':
          navigation.navigate('Movie', { screen: 'MovieMain' });
          setTimeout(() => {
            navigation.navigate('Movie', {
              screen: 'MovieDetail',
              params: { postId: targetIdNum }
            });
          }, 50);
          break;

        // 음악 추천 (게시글, 댓글)
        case 'musicpost':
        case 'musiccomment':
          navigation.navigate('Music', { screen: 'MusicMain' });
          setTimeout(() => {
            navigation.navigate('Music', {
              screen: 'MusicDetail',
              params: { postId: targetIdNum }
            });
          }, 50);
          break;
        // 팔로우 알림 클릭 시 마이페이지로 이동
         case 'follow':
          console.log('👉 팔로우한 유저 프로필로 이동:', noti.senderId);

          // YourPageScreen이 Stack Navigator의 이름이 아니라 '화면 이름'이라면
          // 이렇게 바로 params를 던져주는 것이 정석입니다.
          navigation.navigate('YourPageScreen', {
            targetUserId: noti.senderId,           // ✅ 바로 꺼낼 수 있게 전달
            targetUserNickname: noti.message.split('님이')[0]
          });
          break;
          
        default:
          console.log('알 수 없는 타겟 타입:', noti.targetType);
      }
    } catch (error) {
      console.error('알림 클릭 처리 실패:', error);
    }
    setIsNotiVisible(false);
  };

  //드롭다운 데이터 변환
  const notiOptions = notifications.length > 0
    ? notifications.map(noti => ({
        label: `${noti.isRead === 'N' ? '[new] ': ''}${noti.message}`,
        value: noti,
    }))
    : [{ label: '새로운 알림이 없습니다.', value: null }];

  return (
    <View style={styles.header}>
      {/* 왼쪽 영역 */}
      <View style={styles.left}>
        {/* 뒤로가기 버튼 */}
        {canGoBack && (
          <TouchableOpacity
            style={{
              marginRight: 8,
              padding: 4,
              width: 32,
              alignItems: 'center',
            }}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="#004E89"
            />
          </TouchableOpacity>
        )}

        {/* 로고 */}
        <MaterialCommunityIcons name="flash" size={24} color="#004E89" />
        <Text style={styles.title}>Re:Charge</Text>
      </View>

      {/* 오른쪽 영역 */}
      <View style={styles.right}>
        <>
          {/*  공지사항 버튼  */}
          <IconButton
            type="notice"
            size={24}
            color="#585858ff"
            style={{marginRight: -2}}
            onPress={() =>
              navigation.navigate('Notice', {screen: 'NoticeMain'})
            }
          />
          {/* 알림 */}
          <View ref={alarmIconRef} collapsable={false}>
            <IconButton
              type="alarm"
              size={24}
              color="#585858ff"
              style={{marginRight: -2}}
              onPress={handleAlarmClick}
            />
            {hasUnread && <View style={styles.redDot} />}
          </View>
          {/* 세팅 */}
          <IconButton
            type="setting"
            size={24}
            color="#585858ff"
            onPress={() =>
              navigation.navigate('Setting', {screen: 'SettingMain'})
            }
            style={{marginRight: -15}}
          />
        </>
      </View>

      <DropdownModalKSA
        visible={isNotVisible}
        onClose={() => setIsNotiVisible(false)}
        options={
          notiOptions.length > 0
            ? notiOptions
            : [{label: '새로운 알림이 없습니다.', value: null}]
        }
        selectedValue={null}
        onSelect={item => {
          if (item.value) {
            console.log('알림 클릭:', item.value);
            handleNotificationSelect(item);
          } else {
            setIsNotiVisible(false);
          }
        }}
        top={dropDownPosition.top}
        left={dropDownPosition.left}
        width={220}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#004E89',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDot: {
    position: 'absolute',
    right: 6,
    top: 21,
    width: 7,
    height: 7,
    borderRadius: 3,
    backgroundColor: '#f85757ff',
    zIndex: 1,
  },
});
