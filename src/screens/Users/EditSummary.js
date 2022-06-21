import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import format from "date-fns/format";
import { View, TextInput, StyleSheet, Image, ScrollView } from "react-native";
import { useToast } from "react-native-fast-toast";
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../../theme";
import { useAuth } from "../../context";
import CountDown from "react-native-countdown-component";
import { extractResponseErrorMessage } from "../../utils/request.utils";
import { SummarySubmittedModal } from "../../modals/SummarySubmittedModal";
import { AppMediumText, AppText, Button, HeaderWithBack, PageLoading } from "../../components";

const wordCount = (text = "") => {
    if (!text) {
        return 0;
    }

    return text.trim().split(" ").length;
};

export const EditSummary = ({ navigation, route }) => {
    const { articleID } = route.params;

    const toast = useToast();

    const [playing, setPlaying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [summaryText, setSummaryText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { authenticatedRequest } = useAuth();

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

    useQuery(["summary", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary/detail", { params: { article: articleID } });

            if (data?.data?.summary) {
                setSummaryText(data.data.summary.content);
                return data.data.summary;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const articleViewResponse = useQuery(["summary-view-status", articleID], async () => {
        const { data } = await authenticatedRequest().get("/summary/submission-status", {
            params: { id: articleID },
        });

        console.log("summary status: ", data);

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

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

    const handleSummaryTextSubmission = async (saveAsDraft) => {
        if (summaryText.trim().length < 1) {
            return toast.show("Kindly submit content for summary.");
        }

        const summaryMaxWordCount = settingsResponse.data?.summary?.count || 200;

        if (wordCount(summaryText) > summaryMaxWordCount) {
            return toast.show("Summary text is too long.");
        }

        try {
            setIsSubmitting(true);

            const { data } = await authenticatedRequest().post("/summary", {
                article: articleID,
                content: summaryText,
                isDraft: saveAsDraft,
            });

            if (data && data.data) {
                setShowModal(true);
                toast.show(data.data.message, { type: "success" });
            } else {
                throw new Error("There is a problem submitting your summary. Kindly try again");
            }
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));
            setIsSubmitting(false);
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

    const summaryMaxWordCount = settingsResponse.data?.summary?.count || 200;

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
            <ScrollView>
                {renderMedia(article)}

                <View style={styles.contentContainerStyle}>
                    <AppMediumText style={styles.title}>{article.title}</AppMediumText>
                    <View style={styles.dateBox}>
                        <View style={styles.postedBox}>
                            <AppText style={styles.dateText}>
                                Published date: {format(new Date(article.createdAt), "MMM dd, yyyy")} |
                            </AppText>
                        </View>
                        <View style={[styles.deadlineBox, { marginLeft: RFPercentage(1) }]}>
                            <AppText style={styles.dateText}>
                                Deadline: {format(new Date(article.deadline), "MMM dd, yyyy")}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.summaryWrapper}>
                        <TextInput
                            multiline={true}
                            value={summaryText}
                            textAlignVertical="top"
                            style={styles.summaryInput}
                            onChangeText={setSummaryText}
                            placeholder="Enter summary here..."
                        />
                        <View>
                            <AppText style={styles.textCountLabel}>
                                {wordCount(summaryText)}/{summaryMaxWordCount} words
                            </AppText>
                        </View>
                    </View>

                    <AppText style={styles.rewardNote}>
                        <AppMediumText>Note:</AppMediumText> You are not eligible for any reward if you do not have
                        active paid subscription
                    </AppText>

                    <Button label="Submit" disabled={false} style={styles.button} onPress={() => setShowModal(true)} />

                    <Button
                        label="Save Draft"
                        disabled={isSubmitting}
                        style={styles.draftBtn}
                        labelStyle={styles.draftBtnLabel}
                        onPress={() => handleSummaryTextSubmission(true)}
                    />

                    {articleSubmissionStatus.canSubmit && (
                        <View style={styles.timerWrapper}>
                            <AppText style={styles.countdownLabel}>Time Remaining</AppText>
                            <CountDown
                                size={20}
                                timeToShow={["H", "M", "S"]}
                                digitStyle={styles.digitStyle}
                                until={articleSubmissionStatus.timeLeft}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={styles.root}>
            <HeaderWithBack navigation={navigation} />
            {renderContent()}
            <SummarySubmittedModal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    navigation.navigate("Home");
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        color: theme.colors.primary,
        fontSize: RFPercentage(2.7),
    },
    featureImageBox: {
        height: RFPercentage(25),
    },
    featureImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    centerView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainerStyle: {
        padding: RFPercentage(3),
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
    dateText: {
        color: "#8D8D8D",
        fontSize: RFPercentage(1.6),
    },
    deadlineBox: {
        alignItems: "center",
        flexDirection: "row",
    },
    summaryWrapper: {
        borderWidth: 2,
        borderRadius: 10,
        height: RFPercentage(30),
        marginTop: RFPercentage(3),
        paddingVertical: RFPercentage(1),
        borderColor: theme.colors.primary,
        paddingHorizontal: RFPercentage(1.5),
    },
    summaryInput: {
        flex: 1,
    },
    textCountLabel: {
        textAlign: "right",
        color: "#AFAFAF",
        fontSize: RFPercentage(2.2),
    },
    button: {
        marginTop: 10,
    },
    rewardNote: {
        marginVertical: 10,
        fontSize: RFPercentage(2),
    },
    draftBtn: {
        marginTop: 10,
        paddingHorizontal: 0,
        backgroundColor: "#F5F5F5",
    },
    draftBtnLabel: {
        color: theme.colors.primary,
    },
    timerWrapper: {
        alignItems: "center",
    },
    countdownLabel: {
        marginTop: 10,
        fontSize: RFPercentage(1.8),
    },
    digitStyle: {
        backgroundColor: "transparent",
    },
});
