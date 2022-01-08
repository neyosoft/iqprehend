import React from "react";
import { useQuery } from "react-query";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, Image, ActivityIndicator, TouchableWithoutFeedback, TouchableOpacity } from "react-native";

import { AppBoldText, AppText } from "../../../../components";
import { VideoArticleIcon } from "../../../../icons";

import theme from "../../../../theme";
import { useAuth } from "../../../../context";

export const TopArticles = ({ search }) => {
    const navigation = useNavigation();
    const { authenticatedRequest } = useAuth();

    const articlesResponse = useQuery(["articles", search], async () => {
        try {
            const { data } = await authenticatedRequest().get("/articles/published", { params: { search } });

            if (data && data.data) {
                return data.data;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const renderOutput = () => {
        if (articlesResponse.isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            );
        }

        if (articlesResponse?.data?.articles?.length < 1) {
            <View style={styles.loadingContainer}>
                <AppText>No article found</AppText>
            </View>;
        }

        return (
            <View style={styles.articleWrapper}>
                {articlesResponse.data.articles.slice(0, 9).map((record) => (
                    <TouchableWithoutFeedback
                        onPress={() => navigation.navigate("SingleArticleView", { articleID: record._id })}>
                        <View style={styles.cellContainer} key={record._id}>
                            {record.articleType === "TEXT" ? (
                                <View style={styles.imagebox}>
                                    <Image
                                        resizeMode="cover"
                                        style={styles.articleFeatureImage}
                                        source={{ uri: record.featuredImage }}
                                    />
                                </View>
                            ) : (
                                <View style={styles.videoImageWrapper}>
                                    <VideoArticleIcon />
                                </View>
                            )}
                            <AppText style={styles.cellText}>{record.title}</AppText>
                        </View>
                    </TouchableWithoutFeedback>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <AppBoldText style={styles.title}>Top Articles</AppBoldText>

                <TouchableOpacity onPress={() => navigation.navigate("Articles")}>
                    <AppText style={styles.allArticleText}>All Articles</AppText>
                </TouchableOpacity>
            </View>

            {renderOutput()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    loadingContainer: {
        alignSelf: "center",
        margin: RFPercentage(4),
        justifyContent: "center",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: RFPercentage(3.5),
        color: theme.colors.primary,
    },
    articleWrapper: {
        marginTop: 10,
        flexWrap: "wrap",
        flexDirection: "row",
    },
    cellContainer: {
        width: `${100 / 3}%`,
        paddingRight: RFPercentage(2),
        marginBottom: RFPercentage(2),
    },
    cellText: {
        marginTop: 5,
        fontSize: RFPercentage(1.7),
        lineHeight: RFPercentage(2.3),
    },
    videoImageWrapper: {
        alignItems: "center",
        backgroundColor: "#C4C4C4",
        height: RFPercentage(8),
        justifyContent: "center",
        borderRadius: RFPercentage(1),
    },
    imagebox: {
        overflow: "hidden",
        height: RFPercentage(8),
        backgroundColor: "#C4C4C4",
        borderRadius: RFPercentage(1),
    },
    articleFeatureImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    allArticleText: {
        fontSize: RFPercentage(1.8),
    },
});
