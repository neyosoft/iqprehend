import React from "react";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, Image, TouchableWithoutFeedback } from "react-native";

import theme from "../../../../theme";
import { useAuth } from "../../../../context";
import { AppBoldText, AppText } from "../../../../components";

export const WelcomeHeader = () => {
    const { user } = useAuth();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <AppBoldText style={styles.welcomeText}>Hello {user.firstName},</AppBoldText>

                <AppText style={styles.welcomeSubtitle}>What are you reading today?</AppText>
            </View>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("Settings")}>
                <Image
                    style={styles.photo}
                    source={
                        user?.profilePicture
                            ? { uri: user.profilePicture }
                            : require("../../../../assets/images/avatar.jpg")
                    }
                />
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: RFPercentage(2),
        backgroundColor: "#F4F4F4",
        paddingBottom: RFPercentage(6),
        justifyContent: "space-between",
    },
    leftContainer: {
        flex: 1,
    },
    welcomeText: {
        color: theme.colors.primary,
        fontSize: RFPercentage(3.5),
    },
    welcomeSubtitle: {
        marginTop: 2,
        color: "#6A6A6A",
        fontSize: RFPercentage(2),
    },
    photo: {
        width: RFPercentage(6),
        height: RFPercentage(6),
        borderRadius: RFPercentage(6),
    },
});
