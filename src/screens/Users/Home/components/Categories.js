import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AppBoldText } from "../../../../components";

import theme from "../../../../theme";

export const Categories = () => {
    return (
        <View style={styles.container}>
            <AppBoldText style={styles.title}>Categories</AppBoldText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    title: {
        fontSize: RFPercentage(4),
        color: theme.colors.blue,
    },
});
