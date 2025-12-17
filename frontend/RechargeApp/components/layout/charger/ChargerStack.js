import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChargerMainScreen from '../../../screens/charger/ChargerMainScreen';
import ChargerDetailScreen from '../../../screens/charger/ChargerDetailScreen';
import Header from '../../layout/Header';

const Stack = createNativeStackNavigator();

export default function ChargerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChargerMain"
        component={ChargerMainScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="ChargerDetail"
        component={ChargerDetailScreen}
        options={{header: props => <Header {...props} />}}
      />
    </Stack.Navigator>
  );
}
