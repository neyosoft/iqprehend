import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AppBoldText, AppText } from "../../../../components";
import { useAuth } from "../../../../context";
import theme from "../../../../theme";

export const WelcomeHeader = () => {
    const { user } = useAuth();

    console.log(user);

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
        justifyContent: "space-between",
    },
    leftContainer: {
        flex: 1,
    },
    welcomeText: {
        color: theme.colors.blue,
        fontSize: RFPercentage(4),
    },
    welcomeSubtitle: {
        color: "#6A6A6A",
        lineHeight: RFPercentage(2),
    },
    photo: {
        width: RFPercentage(6),
        height: RFPercentage(6),
        borderRadius: RFPercentage(6),
    },
});
