import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminScreen from '../../../screens/admin/AdminScreen'; // 관리자 메인
import ReportAllScreen from '../../../screens/admin/ReportAllScreen'; // 신고 전체 목록

// 🚨 상세 페이지들 import 필수 (경로가 맞는지 꼭 확인하세요!)
import BoardDetailScreen from '../../../screens/board/BoardDetailScreen';
import MusicDetail from '../../../screens/media/music/MusicDetail';
import MovieDetail from '../../../screens/media/movie/MovieDetail';
import Header from '../../layout/Header';

const Stack = createNativeStackNavigator();

export default function AdminStack({ route }) {
    const user = route.params?.user;
    return (
        <Stack.Navigator>
            {/* 1. 관리자 메인 */}
            <Stack.Screen
                name="AdminMain"
                component={AdminScreen}
                initialParams={{ user: user }}
                options={{ header: props => <Header {...props} /> }}
            />

            {/* 2. 신고 전체 리스트 화면 (여기에 handlePressDetail이 존재함) */}
            <Stack.Screen
                name="ReportAllScreen"
                component={ReportAllScreen}
                initialParams={{ user: user }}
                options={{ header: props => <Header {...props} /> }}
            />

          
            <Stack.Screen
                name="BoardDetail"  // navigate('BoardDetail') 할 때 이 이름을 찾음
                component={BoardDetailScreen}
                options={{ header: props => <Header {...props} /> }}
            />

            <Stack.Screen
                name="MusicDetail"
                component={MusicDetail}
                options={{ header: props => <Header {...props} /> }}
            />

            <Stack.Screen
                name="MovieDetail"
                component={MovieDetail}
                options={{ header: props => <Header {...props} /> }}
            />

        </Stack.Navigator>
    );
}