import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyPageScreen from '../../../screens/mypage/MyPageScreen';
import FollowScreen from '../../../screens/mypage/FollowScreen';
import YourPageScreen from '../../../screens/mypage/YourPageScreen';
import Header from '../Header';

const Stack = createNativeStackNavigator();

export default function MyPageStackNavigation({setIsLoggedIn}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPageMain"
        options={{header: props => <Header {...props} />}}>
        {props => <MyPageScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen
        name="YourPageScreen"
        component={YourPageScreen}
        options={{header: props => <Header {...props} />}}
      />

      <Stack.Screen
        name="Follow"
        component={FollowScreen}
        options={{header: props => <Header {...props} />}}
      />
    </Stack.Navigator>
  );
}
