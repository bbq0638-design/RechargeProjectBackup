import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FindMovieScreen from '../../../screens/media/movie/FindMovieScreen';
import MoviePostScreen from '../../../screens/media/movie/MoviePostScreen';
import MovieDetail from '../../../screens/media/movie/MovieDetail';
import YourPageScreen from '../../../screens/mypage/YourPageScreen';
import FollowScreen from '../../../screens/mypage/FollowScreen';
import Header from '../Header';

const Stack = createNativeStackNavigator();

export default function MovieStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FindMovie"
        component={FindMovieScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="MoviePostScreen"
        component={MoviePostScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
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
