import React from "react";
import { StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import theme from "../theme";

import Theme from "../theme";
import { AppText } from "./AppText";

export const Button = ({ style, label, labelStyle, children, disabled, onPress, ...rest }) => {
    const buttonStyle = [styles.button, style];
    const buttonTextStyle = [styles.buttonText];

    if (disabled) {
        buttonStyle.push(styles.disabledBtn);
        buttonTextStyle.push(styles.disabledBtnText);
    }
    buttonTextStyle.push(labelStyle);

    return (
        <RectButton onPress={disabled ? () => {} : onPress} testID="theButton" style={buttonStyle} {...rest}>
            {children ? children : <AppText style={buttonTextStyle}>{label}</AppText>}
        </RectButton>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.button,
        paddingVertical: RFPercentage(2),
        paddingHorizontal: RFPercentage(10),
        backgroundColor: Theme.colors.primary,
    },
    buttonText: {
        color: "#fff",
        fontSize: RFPercentage(2.3),
    },
    disabledBtn: {
        backgroundColor: theme.colors.diabledBtn,
    },
    disabledBtnText: {
        color: theme.colors.diabledBtnText,
    },
});
