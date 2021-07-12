import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import UserNavigation from "./user";
import AuthNavigation from "./auth";
import ExpertNavigation from "./expert";
import { useAuth } from "../context";
import { AppText } from "../components";

export default function AppNavigation() {
    const { isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <AppText>Loading...</AppText>
            </View>
        );
    }

    return <NavigationContainer>{switchNavigator(user)}</NavigationContainer>;
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
