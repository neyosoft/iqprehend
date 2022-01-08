import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import theme from "../../../../theme";

export const Header = () => (
    <View style={styles.header}>
        <Image source={require("../../../../assets/images/logo.png")} resizeMode="contain" style={styles.image} />
    </View>
);

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        padding: RFPercentage(2),
        backgroundColor: theme.colors.primary,
    },
    image: {
        height: 30,
    },
});
