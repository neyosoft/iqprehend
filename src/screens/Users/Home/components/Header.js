import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import theme from "../../../../theme";

export const Header = () => {
    return (
        <View style={styles.header}>
            <Image source={require("../../../../assets/images/logo.png")} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        padding: RFPercentage(2),
        backgroundColor: theme.colors.blue,
    },
});
