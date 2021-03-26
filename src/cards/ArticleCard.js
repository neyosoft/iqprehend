import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AppMediumText, AppText } from "../components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RectButton } from "react-native-gesture-handler";
import theme from "../theme";

export const ArticleCard = ({ style, title, imageSource, onPress }) => (
    <RectButton style={[styles.card, style]} onPress={onPress}>
        <View style={styles.leftSide}>
            <AppMediumText style={styles.title}>{title}</AppMediumText>
            <AppText style={styles.postedDate}>June 27th, 2021</AppText>
            <View style={styles.viewRow}>
                <AppMediumText style={styles.readText}>Read Article</AppMediumText>
                <Icon name="menu-right" size={RFPercentage(3)} />
            </View>
        </View>
        <Image source={imageSource} />
    </RectButton>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 2,
    },
    title: {
        color: theme.colors.primary,
        fontSize: RFPercentage(2.3),
        lineHeight: RFPercentage(3),
    },
    postedDate: {
        color: "#6B6B6B",
        fontSize: RFPercentage(1.8),
    },
    readText: {
        fontSize: RFPercentage(1.8),
        textDecorationLine: "underline",
    },
    leftSide: {
        flex: 1,
        marginRight: RFPercentage(2),
    },
    articleBody: {
        fontSize: RFPercentage(1.8),
    },
    viewRow: {
        flexDirection: "row",
        alignItems: "center",
    },
});
