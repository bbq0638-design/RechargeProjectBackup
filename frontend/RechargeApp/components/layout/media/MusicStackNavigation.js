import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FindMusicScreen from '../../../screens/media/music/FindMusicScreen';
import MusicPostScreen from '../../../screens/media/music/MusicPostScreen';
import MusicDetail from '../../../screens/media/music/MusicDetail';
import YourPageScreen from '../../../screens/mypage/YourPageScreen';
import FollowScreen from '../../../screens/mypage/FollowScreen';
import Header from '../Header';

const Stack = createNativeStackNavigator();

export default function MusicStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FindMusic"
        component={FindMusicScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="MusicPostScreen"
        component={MusicPostScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="MusicDetail"
        component={MusicDetail}
        options={{header: props => <Header {...props} />}}
      />
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
