import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

export const TextField = ({ style, ...rest }) => {
    return (
        <TextInput
            autoCorrect={false}
            returnKeyType="done"
            placeholderTextColor="#6D6D6D"
            underlineColorAndroid="transparent"
            enablesReturnKeyAutomatically={true}
            {...rest}
            style={[styles.input, style]}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: RFPercentage(7),
        backgroundColor: "#F2F2F2",
        fontSize: RFPercentage(2.1),
        paddingLeft: RFPercentage(2),
        fontFamily: "ProximaNova-Regular",
    },
});
