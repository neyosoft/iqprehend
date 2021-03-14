import React from "react";
import { View, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import { AppBoldText, AppText, Button, Page, PasswordField, TextField } from "../../components";
import theme from "../../theme";

export const Login = () => {
    return (
        <Page style={styles.page}>
            <View style={styles.header}>
                <AppText style={styles.pageTitle}>Sign In</AppText>
            </View>
            <View style={styles.form}>
                <TextField placeholder="Enter Email" />
                <PasswordField style={styles.input} placeholder="Enter Password" />

                <AppBoldText style={styles.forgetPassword}>Forget Password?</AppBoldText>
            </View>

            <Button label="Log In" />
            <View style={styles.registerActionBox}>
                <AppText>Don't have an account?</AppText>
                <AppBoldText>Sign Up</AppBoldText>
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: RFPercentage(2),
        marginBottom: RFPercentage(5),
    },
    pageTitle: {
        fontSize: RFPercentage(3),
        color: theme.colors.secondary,
    },
    input: {
        marginTop: RFPercentage(2),
    },
    form: {
        marginBottom: RFPercentage(6),
    },
    forgetPassword: {
        marginTop: RFPercentage(2),
        fontSize: RFPercentage(2),
    },
    registerActionBox: {
        marginTop: RFPercentage(2),
        flexDirection: "row",
        alignItems: "center",
    },
});
