import React from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../../../../theme";

export const Header = ({ navigation }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={navigation.goBack} style={styles.backIcon}>
                <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
            </TouchableOpacity>
            <Image source={require("../../../../assets/images/logo.png")} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        padding: RFPercentage(2),
        backgroundColor: theme.colors.primary,
    },
    backIcon: {
        position: "absolute",
        left: RFPercentage(2),
        top: RFPercentage(2),
    },
});
