import React from "react";
import { View, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";

import Theme from "../theme";
import { AppText } from "./AppText";

export const Button = ({ style, label, children, ...rest }) => {
    return (
        <View style={[style, styles.container]}>
            <RectButton testID="theButton" style={styles.button} {...rest}>
                {children ? children : <AppText style={styles.buttonText}>{label}</AppText>}
            </RectButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    button: {
        flex: 1,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        padding: RFPercentage(2.5),
        paddingVertical: RFPercentage(3),
        backgroundColor: Theme.colors.primary,
    },
    buttonText: {
        color: "#fff",
    },
});
