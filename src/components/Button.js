import React from "react";
import { View, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import theme from "../theme";

import Theme from "../theme";
import { AppText } from "./AppText";

export const Button = ({ style, label, children, ...rest }) => {
    const buttonStyle = [style, styles.container];
    const buttonTextStyle = [styles.buttonText];

    if (rest.disabled) {
        buttonStyle.push(styles.disabledBtn);
        buttonTextStyle.push(styles.disabledBtnText);
    }

    return (
        <View style={buttonStyle}>
            <RectButton testID="theButton" style={styles.button} {...rest}>
                {children ? children : <AppText style={buttonTextStyle}>{label}</AppText>}
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
        paddingVertical: RFPercentage(3.5),
        backgroundColor: Theme.colors.primary,
    },
    buttonText: {
        color: "#fff",
    },
    disabledBtn: {
        backgroundColor: theme.colors.diabledBtn,
    },
    disabledBtnText: {
        color: theme.colors.diabledBtnText,
    },
});
