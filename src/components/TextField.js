import React, { forwardRef } from "react";
import { TextInput, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import theme from "../theme";

export const TextField = forwardRef(({ style, error, ...rest }, ref) => {
    const inputStyles = [styles.input, style];

    if (error) inputStyles.push(styles.error);

    return (
        <TextInput
            ref={ref}
            autoCorrect={false}
            returnKeyType="done"
            placeholderTextColor="#6D6D6D"
            underlineColorAndroid="transparent"
            enablesReturnKeyAutomatically={true}
            {...rest}
            style={inputStyles}
        />
    );
});

const styles = StyleSheet.create({
    input: {
        height: RFPercentage(7),
        backgroundColor: "#F2F2F2",
        fontSize: RFPercentage(2.1),
        paddingLeft: RFPercentage(2),
        fontFamily: "ProximaNova-Regular",
        borderRadius: theme.radius.input,
    },
    error: {
        borderWidth: 1,
        borderColor: "#FF7878",
    },
});
