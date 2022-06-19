import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { format, isPast } from "date-fns";
import HTML from "react-native-render-html";
import { useToast } from "react-native-fast-toast";
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CountDown from "react-native-countdown-component";

import {
    View,
    Image,
    Share,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useWindowDimensions,
} from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { useFocusEffect } from "@react-navigation/native";
import { PaymentPlanModal } from "../../modals/PaymentPlanModal";
import { extractResponseErrorMessage } from "../../utils/request.utils";
import { AppMediumText, AppText, Button, HeaderWithBack, PageLoading } from "../../components";

const wordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(" ").length;
};

export const SingleArticleView = ({ navigation, route }) => {
    const toast = useToast();
    const { authenticatedRequest } = useAuth();

    const contentWidth = useWindowDimensions().width;

    const [playing, setPlaying] = useState(false);
    const [summaryText, setSummaryText] = useState("");
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);

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

    const articlesSummaryResponse = useQuery(["articles-summary", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary/detail", { params: { article: articleID } });

            if (data && data.data) {
                setSummaryText(data.data?.summary?.content || "");

                return data.data.summary;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
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

    useFocusEffect(
        React.useCallback(() => {
            settingsResponse.refetch();
            articlesResponse.refetch();
            articleViewResponse.refetch();
            articlesSummaryResponse.refetch();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    );

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

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

    const handleSummaryTextSubmission = async () => {
        if (summaryText.trim().length < 1) {
            return toast.show("Kindly submit content for summary.");
        }

        const summaryMaxWordCount = settingsResponse.data?.summary?.count || 200;

        if (wordCount(summaryText) > summaryMaxWordCount) {
            return toast.show("Summary text is too long.");
        }

        try {
            setIsSubmitting(true);

            const { data } = articlesSummaryResponse.data
                ? await authenticatedRequest().put("/summary", {
                      id: articlesSummaryResponse.data._id,
                      content: summaryText,
                  })
                : await authenticatedRequest().post("/summary", {
                      article: articleID,
                      content: summaryText,
                  });

            if (data && data.data) {
                toast.show(data.data.message, { type: "success" });
                navigation.goBack();
            } else {
                throw new Error("There is a problem submitting your summary. Kindly try again");
            }
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));
            setIsSubmitting(false);
        }
    };

    const renderUserSummaryResponse = (summary) => {
        if (!summary?.isEvaluated) {
            return (
                <View>
                    <AppMediumText style={styles.statusTitle}>Status</AppMediumText>
                    <AppText style={styles.statusDescription}>Evaluation in progress...</AppText>
                </View>
            );
        }

        if (summary?.isFreeSummary) {
            return (
                <View>
                    <AppMediumText style={styles.statusTitle}>Status</AppMediumText>
                    <AppText style={styles.statusDescription}>
                        Your summary can not be evaluated because you do not have active subscription when summary was
                        submitted..
                    </AppText>
                </View>
            );
        }

        if (summary?.isFailed) {
            return (
                <View>
                    <AppMediumText style={styles.statusTitle}>Status</AppMediumText>
                    <AppText style={styles.statusDescription}>
                        Thank you for your participation. You failed the preliminary stage of the summary review.
                    </AppText>
                    <Button
                        label="View Result"
                        style={styles.viewResultBtn}
                        onPress={() =>
                            navigation.navigate("EvaluationResult", {
                                summaryId: summary._id,
                                articleID: summary.article._id,
                            })
                        }
                    />
                </View>
            );
        }

        if (!summary?.isExpertReviewed) {
            return (
                <View>
                    <AppMediumText style={styles.statusTitle}>Status</AppMediumText>
                    <AppText style={styles.statusDescription}>
                        Thank you for your participation. Your summary is currently under review.
                    </AppText>
                    <Button
                        label="View Result"
                        style={styles.viewResultBtn}
                        onPress={() =>
                            navigation.navigate("EvaluationResult", {
                                summaryId: summary._id,
                                articleID: summary.article._id,
                            })
                        }
                    />
                </View>
            );
        }

        if (summary?.isExpertReviewed && summary?.linkId && !summary?.voting) {
            return (
                <View>
                    <AppMediumText style={styles.statusTitle}>Voting Link</AppMediumText>
                    <AppText style={styles.summaryDescription}>
                        You can share the link below with your friends and family. Their votes can boost our summary
                        score.
                    </AppText>

                    <TouchableOpacity
                        style={styles.linkWrapper}
                        onPress={() => handleInvitationShare(`http://www.iqprehend.com/voting/${summary.linkId}`)}>
                        <AppText style={styles.link}>http://www.iqprehend.com/voting/{summary.linkId}</AppText>
                    </TouchableOpacity>

                    <Button
                        label="View Result"
                        style={styles.viewResultBtn}
                        onPress={() =>
                            navigation.navigate("EvaluationResult", {
                                summaryId: summary._id,
                                articleID: summary.article._id,
                            })
                        }
                    />
                </View>
            );
        }

        if (summary?.voting) {
            return (
                <Button
                    label="View Result"
                    style={styles.viewResultBtn}
                    onPress={() =>
                        navigation.navigate("EvaluationResult", {
                            summaryId: summary._id,
                            articleID: summary.article._id,
                        })
                    }
                />
            );
        }
    };

    const renderTextSummaryForm = (articleSubmissionStatus) => {
        const settingsConfig = settingsResponse.data;
        const summaryMaxWordCount = settingsConfig?.summary?.count || 200;

        if (articleSubmissionStatus?.canSubmit) {
            return (
                <View>
                    <AppText style={styles.wordCountText}>
                        Summary words: {wordCount(summaryText)}/<AppMediumText>{summaryMaxWordCount}</AppMediumText>
                    </AppText>

                    <TextInput
                        multiline={true}
                        value={summaryText}
                        textAlignVertical="top"
                        style={styles.summaryInput}
                        onChangeText={setSummaryText}
                        placeholder="Enter summary here..."
                    />

                    <AppText style={styles.note}>
                        <AppMediumText>Note:</AppMediumText> You are not eligible for any reward if you do not have
                        active paid subscription
                    </AppText>

                    <Button
                        style={styles.button}
                        disabled={isSubmitting}
                        onPress={handleSummaryTextSubmission}
                        label={isSubmitting ? "Submitting..." : articlesSummaryResponse.data ? "Update" : "Submit"}
                    />
                </View>
            );
        } else {
            const summary = articlesSummaryResponse.data;

            if (!summary) {
                return (
                    <View style={styles.summaryArea}>
                        <AppMediumText style={styles.statusTitle}>Summary</AppMediumText>
                        <AppText style={styles.summaryText}>
                            You can no longer submit summary. Article deadline already exceeded.
                        </AppText>
                    </View>
                );
            }

            return (
                <View>
                    <View style={styles.summaryArea}>
                        <AppMediumText style={styles.statusTitle}>Summary</AppMediumText>
                        <AppText style={styles.summaryText}>{summaryText}</AppText>
                    </View>

                    {renderUserSummaryResponse(summary)}
                </View>
            );
        }
    };

    const handleInvitationShare = (URL) => {
        Share.share(
            {
                uri: URL,
                message: URL,
                title: "Share with your friends and family",
            },
            { dialogTitle: "Share with your friends and family", subject: "Share with your friends and family" },
        );
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
        if (
            articlesResponse.isLoading ||
            articleViewResponse.isLoading ||
            articlesSummaryResponse.isLoading ||
            settingsResponse.isLoading
        ) {
            return <PageLoading />;
        }

        if (
            articlesResponse.isError ||
            articleViewResponse.isError ||
            articlesSummaryResponse.isError ||
            settingsResponse.isError
        ) {
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
                            articlesSummaryResponse.refetch();
                        }}
                    />
                </View>
            );
        }

        const article = articlesResponse.data;
        const articleSubmissionStatus = articleViewResponse.data;

        return (
            <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false} onScroll={handleScroll}>
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
                        <View style={{ alignItems: "center" }}>
                            <AppText style={{ marginVertical: 10, fontSize: RFPercentage(1.8) }}>
                                Time left for submission
                            </AppText>
                            <CountDown
                                size={20}
                                digitTxtStyle={{ color: "#FFF" }}
                                until={articleSubmissionStatus.timeLeft * 60}
                                digitStyle={{ backgroundColor: theme.colors.primary }}
                            />
                        </View>
                    )}

                    <HTML
                        emSize={16}
                        contentWidth={contentWidth}
                        source={{ html: article.content }}
                        baseFontStyle={{
                            textAlign: "justify",
                            fontSize: RFPercentage(2.1),
                            fontFamily: "Rubik-Regular",
                            lineHeight: RFPercentage(3.2),
                        }}
                    />

                    {renderTextSummaryForm(articleSubmissionStatus)}
                </View>

                <PaymentPlanModal
                    show={showPlanModal}
                    onClose={() => setShowPlanModal(false)}
                    onChange={(item) => {
                        setShowPlanModal(false);
                        navigation.navigate("MakePayment", { plan: item });
                    }}
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
});
