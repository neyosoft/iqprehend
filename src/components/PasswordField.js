import React, { useState, forwardRef } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../theme";

export const PasswordField = forwardRef(({ style, inputStyle, error, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const containerStyle = [styles.container, style];

    if (error) containerStyle.push(styles.error);

    return (
        <View style={containerStyle}>
            <TextInput
                ref={ref}
                autoCorrect={false}
                returnKeyType="done"
                secureTextEntry={!showPassword}
                placeholderTextColor="#6D6D6D"
                underlineColorAndroid="transparent"
                enablesReturnKeyAutomatically={true}
                {...rest}
                style={[styles.input, inputStyle]}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "eye-off" : "eye"} size={RFPercentage(3)} color="#7A7A7A" />
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#060169",
        height: RFPercentage(7),
        backgroundColor: "#F2F2F2",
        paddingHorizontal: RFPercentage(2),
        borderRadius: theme.radius.input,
    },
    input: {
        flex: 1,
        fontSize: RFPercentage(2.1),
        fontFamily: "Rubik-Regular",
    },
    error: {
        borderWidth: 1,
        borderColor: "#FF7878",
    },
});
