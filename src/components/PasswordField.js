import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

export const PasswordField = ({ style, inputStyle, ...rest }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, style]}>
            <TextInput
                autoCorrect={false}
                returnKeyType="done"
                secureTextEntry={!showPassword}
                placeholderTextColor="#6D6D6D"
                underlineColorAndroid="transparent"
                enablesReturnKeyAutomatically={true}
                {...rest}
                style={[styles.input, inputStyle]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: RFPercentage(7),
        backgroundColor: "#F2F2F2",
        paddingHorizontal: RFPercentage(2),
    },
    input: {
        fontSize: RFPercentage(2.1),
        fontFamily: "ProximaNova-Regular",
    },
});
