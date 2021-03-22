import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Login, Register, ForgetPassword, PasswordReset, PasswordResetSuccessful } from "../screens/Auth";

const Stack = createStackNavigator();

export default function AuthNavigation() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="PasswordReset" component={PasswordReset} />
            <Stack.Screen name="PasswordResetSuccessful" component={PasswordResetSuccessful} />
        </Stack.Navigator>
    );
}
