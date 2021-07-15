import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import theme from "../theme";
import { AppText } from "./AppText";

export const Checkbox = ({ checked = false, onPress, label, style, ...rest }) => (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} {...rest}>
        <Icon
            size={RFPercentage(3.5)}
            color={theme.colors.primary}
            name={checked ? "circle-slice-8" : "circle-outline"}
        />
        <AppText style={styles.label}>{label}</AppText>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    label: {
        marginLeft: RFPercentage(2),
        fontSize: RFPercentage(2.3),
    },
});
