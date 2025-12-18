import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NoticeMainScreen from '../../../screens/notice/NoticeMainScreen';
import NoticeDetailScreen from '../../../screens/notice/NoticeDetailScreen';
import NoticeWriteScreen from '../../../screens/notice/NoticeWriteScreen';
import Header from '../../layout/Header';
import YourPageScreen from '../../../screens/mypage/YourPageScreen';

const Stack = createNativeStackNavigator();

export default function NoticeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NoticeMain"
        component={NoticeMainScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="NoticeDetail"
        component={NoticeDetailScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="NoticeWrite"
        component={NoticeWriteScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="YourPageScreen"
        component={YourPageScreen}
        options={{ header: props => <Header {...props} /> }}
      />
    </Stack.Navigator>
  );
}
