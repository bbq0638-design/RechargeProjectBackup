import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingMainScreen from '../../../screens/setting/SettingMainScreen';
import SettingPrivacyScreen from '../../../screens/setting/SettingPrivacyScreen';
import SettingLocationScreen from '../../../screens/setting/SettingLocationScreen';
import SettingAppInfoScreen from '../../../screens/setting/SettingAppInfoScreen';
import ModifyProfileScreen from '../../../screens/auth/ModifyProfileScreen';
import ProfileModifyPwdScreen from '../../../screens/auth/ProfileModifyPwdScreen';
import Header from '../../layout/Header';

const Stack = createNativeStackNavigator();

export default function SettingStack( { setIsLoggedIn } ) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingMain"
        component={SettingMainScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="ModifyProfile"
        component={ModifyProfileScreen}
        initialParams={{ setIsLoggedIn: setIsLoggedIn }}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="SettingLocation"
        component={SettingLocationScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="SettingPrivacy"
        component={SettingPrivacyScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="SettingAppInfo"
        component={SettingAppInfoScreen}
        options={{header: props => <Header {...props} />}}
      />
      <Stack.Screen
        name="ResetPwd"
        component={ProfileModifyPwdScreen}
        options={{header: props => <Header {...props} />}}
      />
    </Stack.Navigator>
  );
}
