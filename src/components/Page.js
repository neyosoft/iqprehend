import React from "react";
import { View, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

export const Page = ({ children, style, ...rest }) => (
    <View style={[styles.container, style]} {...rest}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: RFPercentage(3),
    },
});
