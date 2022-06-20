import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";

import {
    Home,
    Payment,
    Category,
    Articles,
    Settings,
    MakePayment,
    PaymentPlans,
    SearchArticle,
    CreateSummary,
    ChangePassword,
    PaymentHistory,
    EvaluationResult,
    PersonalSettings,
    SingleArticleView,
} from "../screens/Users";

import BNHomeIcon from "../assets/icons/HomeIcon";
import BNArticleIcon from "../assets/icons/ArticleIcon";
import BNPaymentIcon from "../assets/icons/PaymentIcon";
import BNSettingIcon from "../assets/icons/SettingsIcon";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                    if (route.name === "Home") {
                        return <BNHomeIcon />;
                    } else if (route.name === "Articles") {
                        return <BNArticleIcon />;
                    } else if (route.name === "Payment") {
                        return <BNPaymentIcon />;
                    } else if (route.name === "Settings") {
                        return <BNSettingIcon />;
                    }
                },
            })}
            tabBarOptions={{
                showLabel: false,
                activeTintColor: "tomato",
                inactiveTintColor: "gray",
                tabStyle: { backgroundColor: "rgba(6, 1, 105, 0.1)" },
            }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Articles" component={Articles} />
            <Tab.Screen name="Payment" component={Payment} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
};

export default function UserNavigation() {
    return (
        <Stack.Navigator
            headerMode="none"
            initialRouteName="TabNavigation"
            screenOptions={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <Stack.Screen name="Category" component={Category} />
            <Stack.Screen name="MakePayment" component={MakePayment} />
            <Stack.Screen name="PaymentPlans" component={PaymentPlans} />
            <Stack.Screen name="SearchArticle" component={SearchArticle} />
            <Stack.Screen name="CreateSummary" component={CreateSummary} />
            <Stack.Screen name="TabNavigation" component={TabNavigation} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="PersonalSettings" component={PersonalSettings} />
            <Stack.Screen name="EvaluationResult" component={EvaluationResult} />
            <Stack.Screen name="SingleArticleView" component={SingleArticleView} />
        </Stack.Navigator>
    );
}
