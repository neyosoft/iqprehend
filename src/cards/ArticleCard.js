import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AppMediumText, AppText } from "../components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RectButton } from "react-native-gesture-handler";

export const ArticleCard = ({ style, title, body, imageSource, onPress }) => (
    <RectButton style={[styles.card, style]} onPress={onPress}>
        <View style={styles.leftSide}>
            <AppMediumText style={styles.title}>{title}</AppMediumText>
            <AppText style={styles.articleBody}>{body}</AppText>
            <View style={styles.viewRow}>
                <AppMediumText>Read Article</AppMediumText>
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
        fontSize: RFPercentage(2.3),
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
