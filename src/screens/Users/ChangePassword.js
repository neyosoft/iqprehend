import React from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AppMediumText, AppText, AppTextField, Button } from "../../components";

import theme from "../../theme";

export const ChangePassword = ({ navigation }) => {
    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>Settings</AppText>
                </View>
                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainerStyle}>
                    <AppMediumText style={styles.title}>Change Password</AppMediumText>

                    <View>
                        <AppTextField style={styles.input} label="New Password" />
                        <AppTextField style={styles.input} label="Confirm Password" />

                        <Button style={styles.button} label="Change Password" />
                    </View>
                </ScrollView>
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
        flex: 1,
    },
    contentContainerStyle: {
        padding: RFPercentage(3),
    },
    title: {
        fontSize: RFPercentage(2.5),
    },
    input: {
        marginTop: RFPercentage(2),
    },
    button: {
        marginTop: RFPercentage(5),
    },
});
