import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BoardScreen from '../../../screens/board/BoardScreen';
import BoardDetailScreen from '../../../screens/board/BoardDetailScreen';
import BoardWriteScreen from '../../../screens/board/BoardWriteScreen';
import Header from '../../layout/Header';

const Stack = createNativeStackNavigator();

export default function BoardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BoardMain"
        component={BoardScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="BoardWrite"
        component={BoardWriteScreen}
        options={{header: props => <Header {...props} />}}
      />
    </Stack.Navigator>
  );
}
