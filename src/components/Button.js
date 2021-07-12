import React from "react";
import { StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import theme from "../theme";

import Theme from "../theme";
import { AppText } from "./AppText";

export const Button = ({ style, label, children, ...rest }) => {
    const buttonStyle = [styles.button, style];
    const buttonTextStyle = [styles.buttonText];

    if (rest.disabled) {
        buttonStyle.push(styles.disabledBtn);
        buttonTextStyle.push(styles.disabledBtnText);
    }

    return (
        <RectButton testID="theButton" style={buttonStyle} {...rest}>
            {children ? children : <AppText style={buttonTextStyle}>{label}</AppText>}
        </RectButton>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.label,
        paddingVertical: RFPercentage(1.5),
        paddingHorizontal: RFPercentage(10),
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
