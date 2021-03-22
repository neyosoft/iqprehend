import React from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AppMediumText, AppText, AppTextField, Button } from "../../components";

import theme from "../../theme";

export const PersonalSettings = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>Settings</AppText>
            </View>
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainerStyle}>
                <AppMediumText style={styles.title}>Personal information</AppMediumText>

                <View style={styles.imageArea}>
                    <View>
                        <View style={styles.profileImageContainer}>
                            <Image style={styles.profileImage} source={require("../../assets/images/image1.png")} />
                        </View>
                        <TouchableOpacity style={styles.uploadIcon}>
                            <Icon name="camera-outline" color="#fff" size={RFPercentage(3.5)} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    <AppTextField style={styles.input} label="First name" />
                    <AppTextField style={styles.input} label="Last name" />
                    <AppTextField style={styles.input} label="Phone number" />

                    <Button style={styles.button} label="Save" />
                </View>
            </ScrollView>
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
    imageArea: {
        alignItems: "center",
        marginVertical: RFPercentage(2),
    },
    profileImageContainer: {
        overflow: "hidden",
        width: RFPercentage(20),
        height: RFPercentage(20),
        borderRadius: RFPercentage(10),
    },
    profileImage: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    uploadIcon: {
        position: "absolute",
        bottom: RFPercentage(3),
        padding: RFPercentage(1.3),
        borderRadius: RFPercentage(20),
        backgroundColor: theme.colors.primary,
    },
    button: {
        marginTop: RFPercentage(5),
    },
});
