import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import {
    Articles,
    Settings,
    MyArticles,
    BankSettings,
    ChangePassword,
    PersonalSettings,
    SingleArticleView,
} from "../screens/Users";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigation = () => {
    return (
        <Drawer.Navigator initialRouteName="Articles">
            <Drawer.Screen name="Articles" component={Articles} options={{ title: "All Articles" }} />
            <Drawer.Screen name="MyArticles" component={MyArticles} options={{ title: "My Articles" }} />
            <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>
    );
};

export default function UserNavigation() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="DrawerNavigation">
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
            <Stack.Screen name="BankSettings" component={BankSettings} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="PersonalSettings" component={PersonalSettings} />
            <Stack.Screen name="SingleArticleView" component={SingleArticleView} />
        </Stack.Navigator>
    );
}
