import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../theme";
import { AppMediumText, AppText, Button } from "../components";
import { ArticleCard } from "../cards/ArticleCard";

export const Home = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="menu" color="#fff" size={RFPercentage(3.5)} />
                <AppText style={styles.headerTitle}>All Articles</AppText>
                <Icon name="magnify" color="#fff" size={RFPercentage(3.5)} />
            </View>
            <View style={styles.content}>
                <View style={styles.filterArea}>
                    <View style={styles.filterBox} />
                    <View style={styles.filterBox} />
                    <Button label="FILTER" style={styles.filterBtn} />
                </View>

                <View style={styles.articleCard}>
                    <View style={styles.articleLeft}>
                        <AppMediumText style={styles.title}>Rhoncus arcu massa.</AppMediumText>
                        <AppText style={styles.articleBody}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae amet, enim consectetur
                            sagittis vitae. Amet nascetur eu, iaculis ullamcorper fermentum aliquam..
                        </AppText>
                        <View>
                            <AppMediumText>Read Article</AppMediumText>
                        </View>
                    </View>
                    <Image source={require("../assets/images/image1.png")} />
                </View>
                <ArticleCard
                    title="Rhoncus arcu massa."
                    body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae amet, enim consectetur
                            sagittis vitae."
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    filterArea: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    filterBox: {
        borderWidth: 1,
        marginRight: 8,
        width: RFPercentage(14),
        height: RFPercentage(5),
        borderRadius: theme.radius.label,
    },
    filterBtn: {
        paddingHorizontal: RFPercentage(3),
        paddingVertical: RFPercentage(1),
    },
    content: {
        padding: RFPercentage(3),
    },
    title: {
        color: theme.colors.primary,
        fontSize: RFPercentage(2.5),
    },
    articleCard: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFPercentage(2),
    },
    articleLeft: {
        flex: 1,
        marginRight: RFPercentage(2),
    },
    articleBody: {
        marginVertical: 5,
    },
});
