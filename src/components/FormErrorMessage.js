import React from "react";
import { View, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../theme";
import { AppText } from "./AppText";

export const FormErrorMessage = ({ label, style }) => {
    return (
        <View style={[styles.container, style]}>
            <Icon name="information" color="#fff" size={RFPercentage(2.5)} />
            <AppText style={styles.label}>{label}</AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: RFPercentage(1),
        borderRadius: theme.radius.label,
        backgroundColor: theme.colors.error,
        marginBottom: RFPercentage(2),
    },
    label: {
        flex: 1,
        color: "#fff",
        marginLeft: RFPercentage(1),
        fontSize: RFPercentage(1.8),
    },
});
