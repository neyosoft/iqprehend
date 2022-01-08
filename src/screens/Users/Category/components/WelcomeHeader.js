import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import theme from "../../../../theme";
import { useAuth } from "../../../../context";
import { AppBoldText, AppText } from "../../../../components";

export const WelcomeHeader = () => {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <AppBoldText style={styles.welcomeText}>Hello {user.firstName},</AppBoldText>

                <AppText style={styles.welcomeSubtitle}>What are you reading today</AppText>
            </View>
            <View>
                <Image
                    style={styles.photo}
                    source={
                        user?.profilePicture
                            ? { uri: user.profilePicture }
                            : require("../../../../assets/images/avatar.jpg")
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: RFPercentage(2),
        backgroundColor: "#F4F4F4",
        justifyContent: "space-between",
        paddingBottom: RFPercentage(6),
    },
    leftContainer: {
        flex: 1,
    },
    welcomeText: {
        color: theme.colors.primary,
        fontSize: RFPercentage(4),
    },
    welcomeSubtitle: {
        color: "#6A6A6A",
        lineHeight: RFPercentage(2.3),
    },
    photo: {
        width: RFPercentage(6),
        height: RFPercentage(6),
        borderRadius: RFPercentage(6),
    },
});
