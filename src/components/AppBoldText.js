import React from "react";
import { Text, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

export const AppBoldText = ({ children, style, ...rest }) => (
    <Text style={[styles.root, style]} {...rest}>
        {children}
    </Text>
);

const styles = StyleSheet.create({
    root: {
        fontSize: RFPercentage(2.1),
        fontFamily: "Rubik-Bold",
    },
});
