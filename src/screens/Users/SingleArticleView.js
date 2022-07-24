import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { format, isPast } from "date-fns";
import HTML from "react-native-render-html";
import YoutubePlayer from "react-native-youtube-iframe";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { View, Image, StyleSheet, ScrollView, useWindowDimensions, Alert } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { PaymentPlanModal } from "../../modals/PaymentPlanModal";
import { extractResponseErrorMessage } from "../../utils/request.utils";
import { SummaryConfirmationModal } from "../../modals/SummaryConfirmationModal";
import { AppMediumText, AppText, Button, HeaderWithBack, NewTimerCountdown, PageLoading } from "../../components";

export const SingleArticleView = ({ navigation, route }) => {
    const { authenticatedRequest } = useAuth();

    const contentWidth = useWindowDimensions().width;

    const [playing, setPlaying] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showSummaryConfirmModal, setShowSummaryConfirmPlanModal] = useState(false);

    const { articleID } = route.params;

    const articlesResponse = useQuery(["articles", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/articles/single", { params: { id: articleID } });

            if (data && data.data && data.data.article) {
                return data.data.article;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const articleViewResponse = useQuery(["article-view-status", articleID], async () => {
        const { data } = await authenticatedRequest().get("/articles/submission-status", {
            params: { id: articleID },
        });

        if (data && data.data) {
            return data.data;
        } else {
            throw new Error("Unable to retreive article summary status");
        }
    });

    const settingsResponse = useQuery("settings", async () => {
        try {
            const { data } = await authenticatedRequest().get("/settings");

            if (data && data.data) {
                return data.data;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const paymentResponse = useQuery("payment", async () => {
        const { data } = await authenticatedRequest().get("/payment/current-subscription");

        if (data && data.data) {
            return data.data;
        } else {
            throw new Error("Unable to retreive payment information");
        }
    });

    const timeup = useCallback(() => {
        Alert.alert("Time up", "You can't submit submission again on this article.");
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            settingsResponse.refetch();
            articlesResponse.refetch();
            articleViewResponse.refetch();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    );

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

    const startSummary = async () => {
        try {
            await authenticatedRequest().post("/summary/start-countdown", { article: articleID });

            setShowSummaryConfirmPlanModal(false);
            navigation.navigate("CreateSummary", { articleID });
        } catch (error) {
            setShowSummaryConfirmPlanModal(false);
            // eslint-disable-next-line no-alert
            alert(extractResponseErrorMessage(error, "Unable to submit summary under this article"));
        }
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const handleScroll = ({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
            if (!isAtBottom) {
                setIsAtBottom(true);
                const noActiveSubscription =
                    !paymentResponse?.data?.planDetails ||
                    isPast(new Date(paymentResponse?.data?.planDetails?.endDate));

                if (noActiveSubscription) {
                    setShowPlanModal(true);
                }
            }
        }
    };

    const renderMedia = (article) => {
        if (article.articleType === "VIDEO") {
            return (
                <YoutubePlayer
                    play={playing}
                    height={RFPercentage(30)}
                    onChangeState={onStateChange}
                    videoId={
                        article.videoLink.includes("youtube")
                            ? article.videoLink.replace("https://www.youtube.com/watch?v=", "")
                            : article?.videoLink?.replace("https://youtu.be/", "")
                    }
                />
            );
        } else {
            if (article.featuredImage) {
                return (
                    <View style={styles.featureImageBox}>
                        <Image resizeMode="cover" style={styles.featureImage} source={{ uri: article.featuredImage }} />
                    </View>
                );
            }
        }
    };

    const renderContent = () => {
        if (articlesResponse.isLoading || articleViewResponse.isLoading || settingsResponse.isLoading) {
            return <PageLoading />;
        }

        if (articlesResponse.isError || articleViewResponse.isError || settingsResponse.isError) {
            return (
                <View style={styles.centerView}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText>There is a problem retrieving article.</AppText>

                    <Button
                        label="Retry"
                        style={{ marginTop: RFPercentage(5) }}
                        onPress={() => {
                            articlesResponse.refetch();
                            settingsResponse.refetch();
                            articleViewResponse.refetch();
                        }}
                    />
                </View>
            );
        }

        const article = articlesResponse.data;
        const articleSubmissionStatus = articleViewResponse.data;

        return (
            <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={true} onScroll={handleScroll}>
                {renderMedia(article)}

                <View style={styles.contentContainerStyle}>
                    <AppMediumText style={styles.title}>{article.title}</AppMediumText>

                    <View style={styles.dateBox}>
                        <View style={styles.postedBox}>
                            <AppText style={styles.postedText}>
                                Published date: {format(new Date(article.createdAt), "MMM dd, yyyy")} |
                            </AppText>
                        </View>
                        <View style={[styles.deadlineBox, { marginLeft: RFPercentage(1) }]}>
                            <AppText style={styles.deadlineText}>
                                Deadline: {format(new Date(article.deadline), "MMM dd, yyyy")}
                            </AppText>
                        </View>
                    </View>

                    {articleSubmissionStatus.canSubmit && (
                        <View style={styles.center}>
                            <AppText style={styles.timeLeftText}>Time left for submission</AppText>

                            <NewTimerCountdown
                                onComplete={timeup}
                                style={styles.coundownLabel}
                                initialSecondsRemaining={articleSubmissionStatus.timeLeft}
                            />
                        </View>
                    )}

                    <HTML
                        emSize={16}
                        contentWidth={contentWidth}
                        source={{ html: article.content }}
                        baseFontStyle={styles.baseFontStyle}
                    />

                    <Button
                        label="Provide Summary"
                        style={styles.summaryBtn}
                        disabled={!articleSubmissionStatus.canSubmit}
                        onPress={() => setShowSummaryConfirmPlanModal(true)}
                    />
                </View>

                <PaymentPlanModal
                    show={showPlanModal}
                    onClose={() => setShowPlanModal(false)}
                    onChange={(item) => {
                        setShowPlanModal(false);
                        navigation.navigate("MakePayment", { plan: item });
                    }}
                />

                <SummaryConfirmationModal
                    onProceed={startSummary}
                    show={showSummaryConfirmModal}
                    onClose={() => setShowSummaryConfirmPlanModal(false)}
                />
            </ScrollView>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={styles.root}>
            <View style={styles.container}>
                <HeaderWithBack navigation={navigation} />
                {renderContent()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    centerView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
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
    content: {
        padding: RFPercentage(3),
    },
    contentContainerStyle: {
        padding: RFPercentage(3),
    },
    title: {
        color: theme.colors.primary,
        fontSize: RFPercentage(2.7),
    },
    dateBox: {
        alignItems: "center",
        flexDirection: "row",
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(1),
    },
    postedBox: {
        alignItems: "center",
        flexDirection: "row",
    },
    postedText: {
        color: "#8D8D8D",
        fontSize: RFPercentage(1.8),
    },
    deadlineBox: {
        alignItems: "center",
        flexDirection: "row",
    },
    deadlineText: {
        color: "#8D8D8D",
        fontSize: RFPercentage(1.8),
    },
    responseRow: {
        flexDirection: "row",
        marginTop: RFPercentage(2),
    },
    responseOption: {
        flexDirection: "row",
        width: RFPercentage(23),
        justifyContent: "center",
        paddingVertical: RFPercentage(1.7),
    },
    summaryArea: {
        backgroundColor: "#ccc",
        marginTop: RFPercentage(3),
        padding: RFPercentage(2),
        marginBottom: RFPercentage(2),
        marginHorizontal: -RFPercentage(3),
        paddingHorizontal: RFPercentage(3),
    },
    wordCountText: {
        marginBottom: 5,
        marginTop: RFPercentage(2),
    },
    summaryInput: {
        color: "#000",
        borderWidth: 1,
        borderColor: "#7A7A7A",
        height: RFPercentage(30),
        textAlignVertical: "top",
        fontSize: RFPercentage(2.1),
        padding: RFPercentage(1.5),
        fontFamily: "Rubik-Regular",
    },
    summaryText: {
        fontSize: RFPercentage(2),
        marginTop: RFPercentage(2),
        lineHeight: RFPercentage(2.7),
    },
    note: {
        marginTop: RFPercentage(2),
        fontSize: RFPercentage(1.8),
        lineHeight: RFPercentage(2.2),
    },
    button: {
        alignSelf: "flex-end",
        marginTop: RFPercentage(4),
    },
    summaryBtn: {
        marginTop: RFPercentage(4),
    },
    audiobox: {
        width: "90%",
        alignItems: "center",
        marginTop: RFPercentage(6),
        alignSelf: "center",
    },
    startBtn: {
        backgroundColor: "#05B54B",
        paddingVertical: RFPercentage(1),
        marginBottom: RFPercentage(2),
    },
    uploadBtn: {
        marginTop: RFPercentage(2),
        paddingVertical: RFPercentage(1),
    },
    featureImageBox: {
        height: RFPercentage(25),
    },
    featureImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    statusTitle: {
        fontSize: RFPercentage(2.3),
    },
    statusDescription: {
        color: "#333",
        fontSize: RFPercentage(2),
    },
    summaryDescription: {
        color: "#333",
        fontSize: RFPercentage(1.8),
    },
    link: {
        color: "blue",
        lineHeight: 25,
        fontSize: RFPercentage(2.2),
        textDecorationLine: "underline",
    },
    viewResultBtn: {
        marginTop: 15,
    },
    baseFontStyle: {
        textAlign: "justify",
        fontSize: RFPercentage(2.1),
        fontFamily: "Rubik-Regular",
        lineHeight: RFPercentage(3.2),
    },
    digitTxtStyle: {
        color: "#fff",
    },
    timeLeftText: {
        marginVertical: 10,
        fontSize: RFPercentage(1.8),
    },
    coundownLabel: {
        fontSize: RFPercentage(2.2),
    },
    center: {
        alignItems: "center",
    },
});
