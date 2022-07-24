import React from "react";
import { format } from "date-fns";
import { useQuery } from "react-query";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback } from "react-native";

import theme from "../../../../theme";
import { useAuth } from "../../../../context";
import { VideoArticleIcon } from "../../../../icons";
import { AppBoldText, AppMediumText, AppText, Button } from "../../../../components";

export const Summaries = () => {
    const navigation = useNavigation();
    const { authenticatedRequest } = useAuth();

    const summaryResponse = useQuery(["latest-summaries"], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary", {
                params: { limit: 9 },
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

    useFocusEffect(
        React.useCallback(() => {
            summaryResponse.refetch();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    );

    const getTimeLeft = (timeInSeconds) => {
        const minutes = Math.floor((timeInSeconds / 60) % 60);
        const hours = Math.floor(timeInSeconds / 3600);

        if (hours >= 1) {
            return `${hours} hr ${minutes} mins`;
        }

        return `${minutes} mins`;
    };

    const renderActionable = (record) => {
        switch (record.stage) {
            case "REVIEW":
                return (
                    <View>
                        <AppText style={styles.createdDateStyle}>
                            Submitted on {format(new Date(record.createdAt), "MMM dd, yyyy")}
                        </AppText>

                        <Button
                            disabled={true}
                            style={styles.summaryBtn}
                            labelStyle={styles.summaryBtnLabel}
                            label="PENDING REVIEW"
                        />
                    </View>
                );
            case "COMPLETED":
                return (
                    <View>
                        <AppText style={styles.createdDateStyle}>
                            Submitted on {format(new Date(record.createdAt), "MMM dd, yyyy")}
                        </AppText>

                        <Button
                            label="VIEW RESULTS"
                            style={styles.summaryBtn}
                            labelStyle={styles.summaryBtnLabel}
                            onPress={() => navigation.navigate("SummaryResult", { articleID: record.article._id })}
                        />
                    </View>
                );

            case "DRAFT":
                return (
                    <View>
                        <AppText style={styles.timeLeftLabel}>
                            Time Remaining:{" "}
                            <AppText style={styles.createdDateStyle}>{getTimeLeft(record.timeLeft)}</AppText>
                        </AppText>
                        <View style={styles.draftBtnWrapper}>
                            <Button
                                label="Continue Editing"
                                labelStyle={styles.summaryBtnLabel}
                                style={[styles.summaryBtn, styles.continueEditBtn]}
                                onPress={() => navigation.navigate("EditSummary", { articleID: record.article._id })}
                            />
                            <TouchableOpacity style={styles.deleteBtn}>
                                <AppText style={styles.deleteBtnLabel}>Delete</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
        }
    };

    const renderOutput = () => {
        if (summaryResponse.isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            );
        }

        if (summaryResponse?.data?.totalDocs === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <AppText>No summary found.</AppText>
                </View>
            );
        }

        return (
            <View style={styles.articleWrapper}>
                {summaryResponse.data?.summaries?.map((record) => (
                    <>
                        <View>
                            <View style={styles.cellContainer} key={record._id}>
                                {record.article.articleType === "TEXT" ? (
                                    <View style={styles.imagebox}>
                                        <Image
                                            resizeMode="cover"
                                            style={styles.articleFeatureImage}
                                            source={{ uri: record.article.featuredImage }}
                                        />
                                    </View>
                                ) : (
                                    <View style={styles.videoImageWrapper}>
                                        <VideoArticleIcon />
                                    </View>
                                )}
                                <View style={styles.rightContainer}>
                                    <TouchableWithoutFeedback
                                        onPress={() =>
                                            navigation.navigate("SingleArticleView", {
                                                articleID: record?.article?._id,
                                            })
                                        }>
                                        <AppMediumText style={styles.articleTitle}>
                                            {record?.article?.title}
                                        </AppMediumText>
                                    </TouchableWithoutFeedback>

                                    {renderActionable(record)}
                                </View>
                            </View>
                        </View>
                        <View style={{ height: RFPercentage(2) }} />
                    </>
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
        marginTop: RFPercentage(3),
        paddingBottom: RFPercentage(3),
    },
    emptyContainer: {
        alignSelf: "center",
        marginTop: RFPercentage(2),
        marginBottom: RFPercentage(4),
        justifyContent: "center",
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
        alignItems: "center",
    },
    rightContainer: {
        flex: 1,
        marginLeft: 10,
    },
    createdDateStyle: {
        marginTop: 5,
        color: "#A3A3A3",
        fontSize: RFPercentage(1.8),
        lineHeight: RFPercentage(2.2),
    },
    summaryBtn: {
        marginTop: 10,
        borderRadius: 3,
        paddingHorizontal: 0,
        paddingVertical: RFPercentage(1.3),
    },
    continueEditBtn: {
        flex: 1,
    },
    summaryBtnLabel: {
        fontSize: RFPercentage(2),
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
        width: RFPercentage(20),
        height: RFPercentage(17),
        backgroundColor: "#C4C4C4",
        borderRadius: RFPercentage(1),
    },
    articleFeatureImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    timeLeftLabel: {
        marginTop: 5,
        color: "#FF5B5B",
        fontSize: RFPercentage(1.8),
    },
    draftBtnWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    deleteBtn: {
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 3,
        marginLeft: 5,
        paddingHorizontal: RFPercentage(1),
        paddingVertical: RFPercentage(1.1),
        borderColor: theme.colors.primary,
    },
    deleteBtnLabel: {
        fontSize: RFPercentage(2),
        color: theme.colors.primary,
    },
});
