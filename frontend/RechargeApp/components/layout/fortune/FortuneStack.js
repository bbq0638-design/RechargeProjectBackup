import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FortuneMainScreen from '../../../screens/fortune/FortuneMainScreen';
import Header from '../../layout/Header';
import YourPageScreen from '../../../screens/mypage/YourPageScreen';

const Stack = createNativeStackNavigator();

export default function FortuneStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FortuneMain"
        component={FortuneMainScreen}
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
