import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import theme from "../theme";
import { AppText } from "./AppText";

export const PageLoading = ({ label = "Loading...", style, ...rest }) => (
    <View style={[styles.container, style]} {...rest}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText style={styles.label}>{label}</AppText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    label: {
        fontSize: RFPercentage(2.5),
        marginTop: RFPercentage(3),
    },
});
