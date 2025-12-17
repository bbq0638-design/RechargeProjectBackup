import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Header from '../../layout/Header';
import NoticeMainScreen from '../../../screens/notice/NoticeMainScreen';
import NoticeDetailScreen from '../../../screens/notice/NoticeDetailScreen';
import NoticeWriteScreen from '../../../screens/notice/NoticeWriteScreen';


const Stack = createNativeStackNavigator();

export default function NoticeStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="NoticeMain"
        component={NoticeMainScreen}
        options={{
          header: props => (
            <Header
              {...props}
              isLoggedIn={true}
              onLogin={() => { }}
              onLogout={() => { }}
              onSignup={() => { }}
            />
          ),
        }}
      />

      <Stack.Screen
        name="NoticeDetail"
        component={NoticeDetailScreen}
        options={{
          header: props => (
            <Header
              {...props}
              isLoggedIn={true}
              onLogin={() => { }}
              onLogout={() => { }}
              onSignup={() => { }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="NoticeWrite"
        component={NoticeWriteScreen}
        options={{
          header: props => (
            <Header
              {...props}
              isLoggedIn={true}
              onLogin={() => { }}
              onLogout={() => { }}
              onSignup={() => { }}
            />
          ),
        }}
      />

    </Stack.Navigator>
  );
}