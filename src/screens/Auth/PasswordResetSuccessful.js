import React from "react";
import { View, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AppBoldText, AppText, Button, Page } from "../../components";

import CONFIG from "../../../config";

export const PasswordResetSuccessful = ({ navigation }) => (
    <Page>
        <View style={styles.container}>
            <Icon name="check-circle" size={RFPercentage(8)} color="#85C6C2" />
            <AppBoldText style={styles.title}>Reset Successful!</AppBoldText>
            <AppText style={styles.description}>
                Your {CONFIG.APPNAME} password has been changed. You may now log in.
            </AppText>

            <Button style={styles.button} label="Log In" onPress={() => navigation.navigate("Login")} />
        </View>
    </Page>
);

const styles = StyleSheet.create({
    container: {
        marginTop: RFPercentage(15),
        alignItems: "center",
    },
    title: {
        fontSize: RFPercentage(3),
        marginTop: RFPercentage(3),
    },
    description: {
        color: "#737272",
        textAlign: "center",
        marginTop: RFPercentage(2),
    },
    button: {
        width: "100%",
        marginTop: RFPercentage(5),
    },
});
