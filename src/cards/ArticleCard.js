import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AppMediumText, AppText } from "../components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RectButton } from "react-native-gesture-handler";

import theme from "../theme";
import { VideoArticleIcon } from "../icons";

export const ArticleCard = ({ style, article, onPress }) => (
    <RectButton style={[styles.card, style]} onPress={onPress}>
        <View style={styles.leftSide}>
            <AppMediumText style={styles.title}>{article.title}</AppMediumText>
            <AppText style={styles.postedDate}>{article.excerpt}</AppText>
            <View style={styles.viewRow}>
                <AppMediumText style={styles.readText}>Read Article</AppMediumText>
                <Icon name="menu-right" size={RFPercentage(3)} />
            </View>
        </View>
        {article.articleType === "VIDEO" ? (
            <View style={{ padding: 20, backgroundColor: "#C4C4C4" }}>
                <VideoArticleIcon />
            </View>
        ) : (
            <View style={styles.imagebox}>
                <Image style={styles.articleFeatureImage} source={{ uri: article.featuredImage }} />
            </View>
        )}
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
    imagebox: {
        width: RFPercentage(11.7),
        height: RFPercentage(10),
        backgroundColor: "#C4C4C4",
    },
    articleFeatureImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
});
