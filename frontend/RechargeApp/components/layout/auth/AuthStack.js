import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../../../screens/auth/LoginScreen';
import FindIdScreen from '../../../screens/auth/FindIdScreen';
import FindPwdScreen from '../../../screens/auth/FindPwdScreen';
import TermsAgreementScreen from '../../../screens/auth/TermsAgreementScreen';
import SignUpScreen from '../../../screens/auth/SignUpScreen';
import FindIdResultScreen from '../../../screens/auth/FindIdResultScreen';
import FindPwdResultScreen from '../../../screens/auth/FindPwdResultScreen';
import ModifyPwdScreen from '../../../screens/auth/ModifyPwdScreen';
import VerifyEmailScreen from '../../../screens/auth/VerifyEmailScreen';
import ModifyProfileScreen from '../../../screens/auth/ModifyProfileScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack({setIsLoggedIn, setUserRole, setUserId}) {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="LoginMain"
        component={LoginScreen}
        initialParams={{setIsLoggedIn, setUserRole, setUserId}}
      />
      <Stack.Screen name="FindIdScreen" component={FindIdScreen} />
      <Stack.Screen name="FindPwdScreen" component={FindPwdScreen} />
      <Stack.Screen
        name="TermsAgreementScreen"
        component={TermsAgreementScreen}
      />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="FindIdResult" component={FindIdResultScreen} />
      <Stack.Screen name="FindPwdResult" component={FindPwdResultScreen} />
      <Stack.Screen name="ResetPwd" component={ModifyPwdScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
}