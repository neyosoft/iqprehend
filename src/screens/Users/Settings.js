import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AppMediumText, AppText } from "../../components";

import theme from "../../theme";

export const Settings = ({ navigation }) => {
    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigation.openDrawer}>
                        <Icon name="menu" color="#fff" size={RFPercentage(3.5)} />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>Settings</AppText>
                </View>
                <View style={styles.content}>
                    <RectButton style={styles.option} onPress={() => navigation.navigate("PersonalSettings")}>
                        <AppMediumText>Personal Information</AppMediumText>
                        <Icon name="chevron-right" size={RFPercentage(3)} />
                    </RectButton>
                    <RectButton style={styles.option} onPress={() => navigation.navigate("BankSettings")}>
                        <AppMediumText>Bank Information</AppMediumText>
                        <Icon name="chevron-right" size={RFPercentage(3)} />
                    </RectButton>
                    <RectButton style={styles.option} onPress={() => navigation.navigate("ChangePassword")}>
                        <AppMediumText>Change Password</AppMediumText>
                        <Icon name="chevron-right" size={RFPercentage(3)} />
                    </RectButton>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: RFPercentage(2),
        backgroundColor: theme.colors.primary,
    },
    headerTitle: {
        flex: 1,
        color: "#fff",
        fontSize: RFPercentage(2.4),
        marginHorizontal: RFPercentage(2),
    },
    content: {
        paddingVertical: RFPercentage(3),
    },
    option: {
        alignItems: "center",
        flexDirection: "row",
        padding: RFPercentage(3),
        justifyContent: "space-between",
    },
});
