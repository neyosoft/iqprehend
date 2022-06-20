import React from "react";
import RNBootSplash from "react-native-bootsplash";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import UserNavigation from "./user";
import AuthNavigation from "./auth";
import { useAuth } from "../context";
import { AppText } from "../components";
import { Onboarding } from "../screens/Onboarding";
import theme from "../theme";

export default function AppNavigation() {
    const { isLoading, user, isOnboardingCompleted } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.centeredView}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <AppText style={styles.loadingText}>Loading...</AppText>
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
            {user?.role === "USER" ? <UserNavigation /> : <AuthNavigation />}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        marginTop: 10,
    },
});
