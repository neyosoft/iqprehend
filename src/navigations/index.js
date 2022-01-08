import React from "react";
import { ActivityIndicator, View } from "react-native";
import RNBootSplash from "react-native-bootsplash";
import { NavigationContainer } from "@react-navigation/native";

import UserNavigation from "./user";
import AuthNavigation from "./auth";
import { useAuth } from "../context";
import ExpertNavigation from "./expert";
import { AppText } from "../components";
import { Onboarding } from "../screens/Onboarding";
import theme from "../theme";

export default function AppNavigation() {
    const { isLoading, user, isOnboardingCompleted } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <AppText style={{ marginTop: 10 }}>Loading...</AppText>
            </View>
        );
    }

    if (!isOnboardingCompleted) return <Onboarding />;

    const linking = {
        prefixes: ["https://iqprehend.com", "iqprehend://"],
        config: {
            initialRouteName: "DrawerNavigation",
            screens: { Voting: "voting/:linkId" },
        },
    };

    return (
        <NavigationContainer linking={linking} onReady={() => RNBootSplash.hide()}>
            {switchNavigator(user)}
        </NavigationContainer>
    );
}

const switchNavigator = (user) => {
    if (!user) {
        return <AuthNavigation />;
    }

    if (user.role === "USER") {
        return <UserNavigation />;
    } else if (user.role === "EXPERT") {
        return <ExpertNavigation />;
    } else {
        return <AuthNavigation />;
    }
};
