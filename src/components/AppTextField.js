import React, { forwardRef } from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import theme from "../theme";
import { AppText } from "./AppText";

export const AppTextField = forwardRef(({ style, label, inputStyle, labelStyle, error, ...rest }, ref) => {
    const theInputStyle = [styles.input, inputStyle];

    if (error) theInputStyle.push(styles.error);

    return (
        <View style={[styles.container, style]}>
            <AppText style={[styles.label, labelStyle]}>{label}</AppText>
            <TextInput
                ref={ref}
                autoCorrect={false}
                returnKeyType="done"
                placeholderTextColor="#6D6D6D"
                underlineColorAndroid="transparent"
                enablesReturnKeyAutomatically={true}
                {...rest}
                style={theInputStyle}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {},
    label: {
        marginBottom: 5,
        fontSize: RFPercentage(2),
    },
    input: {
        color: "#000",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#CACACA",
        height: RFPercentage(6),
        fontSize: RFPercentage(2.1),
        paddingLeft: RFPercentage(2),
        fontFamily: "Baloo2-Regular",
    },
    error: {
        borderWidth: 1,
        borderColor: "#FF7878",
    },
});
