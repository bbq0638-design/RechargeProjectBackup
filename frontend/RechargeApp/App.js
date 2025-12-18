import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 🔹 import 정리 (Platform 중복 제거 및 PermissionsAndroid 추가)
import {Linking, Platform, LogBox, PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import AuthStack from './components/layout/auth/AuthStack';
import BottomNavigation from './components/layout/BottomNavigation';
import {navigationRef} from './components/layout/navigationRef';
import api, { saveFcmToken } from './utils/api';

// ★★★★백그라운드 메시지 핸들러
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('백그라운드/종료 상태에서 메시지 수신:', remoteMessage);

  PushNotification.localNotification({
    channelId: "default-channel-id",
    title: remoteMessage.notification?.title || remoteMessage.data?.title || '알림',
    message: remoteMessage.notification?.body || remoteMessage.data?.body || '새로운 메시지가 도착했습니다.',
    userInfo: remoteMessage.data, 
    data: remoteMessage.data,
    
    smallIcon: "ic_launcher",
    largeIcon: "ic_launcher",
    priority: "high",
    visibility: "public", 
    importance: "high",
  });
});
// ★★★★
LogBox.ignoreLogs([
  'new NativeEventEmitter', 
  'listener',
]);

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // 🔹 [중요] 안드로이드 13+ 알림 권한 요청 함수
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('알림 권한 허용됨');
        } else {
          console.log('알림 권한 거부됨');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleDeepLink = event => {
    const url = event.url;
    console.log('딥링크 감지됨:', url);

    if (!url) return;
    /** 🔹 비밀번호 재설정 딥링크 */
    if (url.includes('reset-password')) {
      const tokenMatch = url.match(/token=([^&]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (token) {
        navigationRef.current?.navigate('ResetPwd', {token});
        return;
      }
    }
    /** 🔹 이메일 인증 딥링크 */
    if (url.includes('email-auth')) {
      const emailMatch = url.match(/email=([^&]+)/);
      const codeMatch = url.match(/code=([^&]+)/);
      const userEmail = emailMatch ? decodeURIComponent(emailMatch[1]) : null;
      const authCode = codeMatch ? decodeURIComponent(codeMatch[1]) : null;

      if (userEmail && authCode) {
        navigationRef.current?.navigate('VerifyEmail', {
          userEmail,
          authCode,
        });
      }
    }
  };
  // ★★★★
  const handleNotificationPress = (data) => {
    if (!data) return;
    
    const { targetType, targetId, senderId } = data;
    const targetIdNum = Number(targetId);

    console.log('알림 클릭 이동:', targetType, targetIdNum);

    if (targetType === 'boardpost' || targetType === 'boardcomment' || targetType === 'boardlike') {
      navigationRef.current?.navigate('MainTabs', {
        screen: 'Board',
        params: { screen: 'BoardDetail', params: { postId: targetIdNum } },
      });
    } else if (targetType === 'moviepost' || targetType === 'moviecomment') {
      navigationRef.current?.navigate('MainTabs', {
        screen: 'Movie',
        params: { screen: 'MovieDetail', params: { postId: targetIdNum } },
      });
    } else if (targetType === 'musicpost' || targetType === 'musiccomment') {
      navigationRef.current?.navigate('MainTabs', {
        screen: 'Music',
        params: { screen: 'MusicDetail', params: { postId: targetIdNum } },
      });
    } else if (targetType === 'follow') {
      navigationRef.current?.navigate('YourPageScreen', {
        targetUserId: senderId,
      });
    }
  };

  // ★★★★
  useEffect(() => {
    // 🔹 앱 시작 시 권한 요청 실행
    requestNotificationPermission();

    PushNotification.createChannel(
      {
        channelId: "default-channel-id",
        channelName: "Default Channel",
        channelDescription: "기본 알림 채널",
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`채널 생성 완료: '${created}'`)
    );

    PushNotification.configure({
      onNotification: function (notification) {
        console.log("알림 클릭됨:", notification);
        const data = notification.data || notification;
        
        if (notification.userInteraction) {
          handleNotificationPress(data);
        }
      },
      requestPermissions: Platform.OS === 'ios',
    });
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const storedUserRole = await AsyncStorage.getItem('userRole');
      const storedUserId = await AsyncStorage.getItem('userId');
      
      setIsLoggedIn(!!token);
      if (storedUserRole) setUserRole(storedUserRole);
      
      if (storedUserId) {
        setUserId(storedUserId);
        
        // ★★★★[추가됨] 자동 로그인 시에도 FCM 토큰을 서버에 다시 저장합니다.
        console.log('자동 로그인 감지: FCM 토큰 업데이트 시도');
        saveFcmToken(storedUserId); 
      }
      
      console.log('저장된 userRole:', storedUserRole);
      setChecking(false);

      // cold start 딥링크 체크
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) handleDeepLink({url: initialUrl});
    };
    checkToken();

    // 앱 실행 중 딥링크 감지
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  // ★★★★앱이 켜져 있을 때 알림 도착 처리 (FCM)
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('앱 켜져있을 때 알림 도착!', remoteMessage);
      PushNotification.localNotification({
        channelId: "default-channel-id",
        title: remoteMessage.notification?.title || '알림',
        message: remoteMessage.notification?.body || '',
        userInfo: remoteMessage.data,
        data: remoteMessage.data,
        
        largeIcon: "ic_launcher", 
        smallIcon: "ic_launcher",
        vibrate: true,
        vibration: 300,
        priority: "high",
      });
    });

    return unsubscribe;
  }, []);
  
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('백그라운드에서 알림 클릭:', remoteMessage);
      handleNotificationPress(remoteMessage.data);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('앱 종료 상태에서 알림 클릭:', remoteMessage);
        setTimeout(() => handleNotificationPress(remoteMessage.data), 1000);
      }
    });
  }, []);

  if (checking) return null;
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLoggedIn ? (
          <Stack.Screen name="MainTabs">
            {() => <BottomNavigation setIsLoggedIn={setIsLoggedIn}
            userRole={userRole}
            userId={userId}
            />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth">
            {() => <AuthStack setIsLoggedIn={setIsLoggedIn}
            setUserRole={setUserRole}
                setUserId={setUserId} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}