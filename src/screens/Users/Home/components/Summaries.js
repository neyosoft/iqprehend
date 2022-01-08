import React from "react";
import { useQuery } from "react-query";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, Image, ActivityIndicator, TouchableWithoutFeedback } from "react-native";

import { VideoArticleIcon } from "../../../../icons";
import { AppBoldText, AppText } from "../../../../components";

import theme from "../../../../theme";
import { useAuth } from "../../../../context";
import { format } from "date-fns";

export const Summaries = () => {
    const navigation = useNavigation();
    const { authenticatedRequest } = useAuth();

    const articlesResponse = useQuery(["all-summaries"], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary", {
                params: { isEvaluated: false },
            });

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

        if (articlesResponse?.data?.totalDocs === 0) {
            return (
                <View style={styles.loadingContainer}>
                    <AppText>No summary found.</AppText>
                </View>
            );
        }

        return (
            <View style={styles.articleWrapper}>
                {articlesResponse.data.summaries.slice(0, 9).map((record) => (
                    <TouchableWithoutFeedback
                        onPress={() => navigation.navigate("SingleArticleView", { articleID: record?.article?._id })}>
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
                            <View style={styles.rightContainer}>
                                <AppText style={styles.articleTitle}>{record?.article?.title}</AppText>
                                <AppText style={styles.createdDateStyle}>
                                    Submitted: {format(new Date(record.createdAt), "MMM dd, yyyy")}
                                </AppText>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <AppBoldText style={styles.title}>My Summaries</AppBoldText>

            {renderOutput()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: RFPercentage(3),
    },
    loadingContainer: {
        alignSelf: "center",
        margin: RFPercentage(4),
        justifyContent: "center",
    },
    title: {
        fontSize: RFPercentage(3.5),
        color: theme.colors.primary,
    },
    articleWrapper: {
        marginTop: 10,
    },
    cellContainer: {
        flexDirection: "row",
    },
    rightContainer: {
        flex: 1,
        marginLeft: 10,
    },
    createdDateStyle: {
        marginTop: 5,
        color: "#6A6A6A",
        fontSize: RFPercentage(1.8),
        lineHeight: RFPercentage(2.2),
    },
    articleTitle: {
        color: theme.colors.primary,
    },
    videoImageWrapper: {
        alignItems: "center",
        width: RFPercentage(17),
        height: RFPercentage(10),
        justifyContent: "center",
        backgroundColor: "#C4C4C4",
        borderRadius: RFPercentage(1),
    },
    imagebox: {
        overflow: "hidden",
        width: RFPercentage(17),
        height: RFPercentage(10),
        backgroundColor: "#C4C4C4",
        borderRadius: RFPercentage(1),
    },
    articleFeatureImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
});
