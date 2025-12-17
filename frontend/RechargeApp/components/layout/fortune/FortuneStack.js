import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FortuneMainScreen from '../../../screens/fortune/FortuneMainScreen';
import Header from '../../layout/Header';

const Stack = createNativeStackNavigator();

export default function FortuneStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FortuneMain"
        component={FortuneMainScreen}
        options={{header: props => <Header {...props} />}}
      />
    </Stack.Navigator>
  );
}
