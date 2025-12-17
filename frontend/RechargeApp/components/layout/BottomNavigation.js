import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BoardStack from './board/BoardStack';
import ChargerStack from './charger/ChargerStack';
import FortuneStack from './fortune/FortuneStack';
import MusicStackNavigation from './media/MusicStackNavigation';
import MyPageStackNavigation from './mypage/MypageStackNavigation';
import MovieStackNavigation from './media/MovieStackNavigation';
import NoticeStack from './notice/NoticeStack';
import SettingStack from './setting/SettingStack';
import AdminStack from './admin/AdminStack';
import YourPageScreen from '../../screens/mypage/YourPageScreen';
import FollowScreen from '../../screens/mypage/FollowScreen';

const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#004E89',
  inactive: '#9CA3AF',
  background: '#F9FAFB',
};

export default function BottomNavigation({setIsLoggedIn, userRole, userId}) {

  return (
    <Tab.Navigator
      initialRouteName="Charge"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 5,
        },
      }}>
      <Tab.Screen
        name="Charge"
        component={ChargerStack}
        options={{
          tabBarLabel: '충전',
          unmountOnBlur: true,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Movie"
        component={MovieStackNavigation}
        options={{
          tabBarLabel: '영화',
          unmountOnBlur: true,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="movie-open" size={24} color={color} />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Movie', {
              screen: 'MovieMain',
            });
          },
        })}
      />

      <Tab.Screen
        name="Music"
        component={MusicStackNavigation}
        options={{
          tabBarLabel: '음악',
          unmountOnBlur: true,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="music" size={24} color={color} />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Music', {
              screen: 'MusicMain',
            });
          },
        })}
      />

      <Tab.Screen
        name="Fortune"
        component={FortuneStack}
        options={{
          tabBarLabel: '운세',
          unmountOnBlur: true,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="star-four-points-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Board"
        component={BoardStack}
        options={{
          tabBarLabel: '게시판',
          unmountOnBlur: true,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="comment-outline"
              size={24}
              color={color}
            />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Board', {
              screen: 'BoardMain',
            });
          },
        })}
      />

      <Tab.Screen
        name="MyPage"
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color={color}
            />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('MyPage', {
              screen: 'MyPageScreen',
            });
          },
        })}>
        {() => <MyPageStackNavigation setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>

     {/* 관리자 전용 탭  */}
      {userRole === 'ADMIN' && (
        <Tab.Screen
          name="AdminTab"
          component={AdminStack}
          // 2. AdminStack으로 userId와 userRole을 넘겨줌 
          initialParams={{ user: { userId: userId, userRole: userRole } }}
          options={{
            tabBarLabel: '관리자',
            unmountOnBlur: true,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="shield-crown-outline" size={24} color={color} />
            ),
          }}
        />
      )}


      <Tab.Screen
        name="Notice"
        component={NoticeStack}
        options={{tabBarButton: () => null}}
      />

      <Tab.Screen
        name="Setting"
        children={() => <SettingStack setIsLoggedIn={setIsLoggedIn} />}
        options={{tabBarButton: () => null}}
      />
      <Tab.Screen
        name="YourPageScreen"
        component={YourPageScreen}
        options={{tabBarButton: () => null}}
      />

      <Tab.Screen
        name="Follow"
        component={FollowScreen}
        options={{tabBarButton: () => null}}
      />
    </Tab.Navigator>
    
  );
}

const styles = StyleSheet.create({});
