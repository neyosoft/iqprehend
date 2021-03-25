import React from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AppMediumText, AppText } from "../../components";

import theme from "../../theme";

export const Payment = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.openDrawer}>
                    <Icon name="menu" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>Payment</AppText>
            </View>
            <View style={styles.content}>
                <AppMediumText style={styles.title}>Active Subscription</AppMediumText>

                <View>
                    <View>
                        <AppText>Type</AppText>
                        <AppText>Yearly</AppText>
                    </View>
                    <View>
                        <AppText>Duration</AppText>
                        <AppText>1 Year</AppText>
                    </View>
                    <View>
                        <AppText>Start Date</AppText>
                        <AppText>June 27, 2020</AppText>
                    </View>
                    <View>
                        <AppText>End Date</AppText>
                        <AppText>June 27, 2021</AppText>
                    </View>
                </View>
            </View>
        </View>
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
        padding: RFPercentage(3),
    },
    option: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: RFPercentage(2),
    },
    title: {
        fontSize: RFPercentage(2.5),
    },
});
