import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../theme";

export const Checkbox = ({ checked = false, onPress, style, ...rest }) => (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} {...rest}>
        <Icon
            size={RFPercentage(3.5)}
            color={theme.colors.primary}
            name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
        />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
});
