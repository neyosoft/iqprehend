import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import { AppText } from "./AppText";
import { TextFilterIcon, VideoFilterIcon } from "../icons";
import theme from "../theme";

export const ArticleFilter = ({ value, onChange }) => (
    <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => onChange("TEXT")}>
            <View style={[styles.itemRow, value === "TEXT" ? styles.activeBackground : undefined]}>
                <TextFilterIcon color={value === "TEXT" ? "#fff" : theme.colors.primary} />
                <AppText style={[styles.label, value === "TEXT" ? styles.activeLabel : undefined]}>Text</AppText>
            </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => onChange("VIDEO")}>
            <View style={[styles.itemRow, value === "VIDEO" ? styles.activeBackground : undefined]}>
                <VideoFilterIcon color={value === "VIDEO" ? "#fff" : theme.colors.primary} />
                <AppText style={[styles.label, value === "VIDEO" ? styles.activeLabel : undefined]}>Video</AppText>
            </View>
        </TouchableWithoutFeedback>
    </View>
);

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 5,
        flexDirection: "row",
        borderColor: theme.colors.primary,
    },
    itemRow: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        padding: RFPercentage(1),
        width: RFPercentage(12),
    },
    label: {
        marginLeft: 5,
        fontSize: RFPercentage(1.8),
        color: theme.colors.primary,
    },
    activeLabel: {
        color: "#fff",
    },
    background: {
        backgroundColor: "#fff",
    },
    activeBackground: {
        backgroundColor: theme.colors.primary,
    },
});
