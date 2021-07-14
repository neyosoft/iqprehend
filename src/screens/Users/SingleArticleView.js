import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { format } from "date-fns";
import { useToast } from "react-native-fast-toast";
import HTML from "react-native-render-html";
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, useWindowDimensions, Image } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { RecordIcon } from "../../icons";
import { debugAxiosError, extractResponseErrorMessage } from "../../utils/request.utils";
import { AppMediumText, AppText, Button, PageLoading } from "../../components";

export const SingleArticleView = ({ navigation, route }) => {
    const toast = useToast();
    const { authenticatedRequest } = useAuth();
    const contentWidth = useWindowDimensions().width;

    const [playing, setPlaying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [summaryText, setSummaryText] = useState("");
    const [responseType, setResponseType] = useState("textual");

    const { articleID } = route.params;

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

    const articlesResponse = useQuery(["articles", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/articles/single", { params: { id: articleID } });

            if (data && data.data) {
                return data.data.article;
            } else {
                throw new Error();
            }
        } catch (error) {
            debugAxiosError(error);
            throw new Error();
        }
    });

    const handleSummaryTextSubmission = async () => {
        if (summaryText.trim().length < 1) {
            return toast.show("Kindly submit content for summary.");
        }

        console.log("submitting summary: ", summaryText);

        try {
            setIsSubmitting(true);
            const { data } = await authenticatedRequest().post("/summary", {
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

    const renderSummaryForm = () => (
        <>
            <AppText style={styles.wordCountText}>
                Summary words: 50/<AppMediumText>200</AppMediumText>
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
                <AppMediumText>Note:</AppMediumText> You are not eligible for any reward if you do not have active paid
                subscription
            </AppText>

            <Button
                style={styles.button}
                disabled={isSubmitting}
                onPress={handleSummaryTextSubmission}
                label={isSubmitting ? "Submitting..." : "Submit"}
            />
        </>
    );

    const renderAudioForm = () => (
        <View style={styles.audiobox}>
            <RecordIcon />

            <Button label="START" style={styles.startBtn} />

            <AppText style={styles.note}>
                <AppMediumText>Note:</AppMediumText> Accepted Format:Mp 3,Wav,AAC (up to 4mb)
            </AppText>

            <Button label="UPLOAD" style={styles.uploadBtn} />

            <AppText style={[styles.note, { textAlign: "center" }]}>
                <AppMediumText>Note:</AppMediumText> Summarize in audio by clicking the START button or UPLOAD button to
                upload from your device
            </AppText>
        </View>
    );

    const renderContent = () => {
        if (articlesResponse.isLoading) {
            return <PageLoading />;
        }

        if (articlesResponse.isError) {
            return (
                <View>
                    <AppText>There is a problem fetching articles.</AppText>
                </View>
            );
        }

        const article = articlesResponse.data;

        console.log("article: ", article);

        return (
            <ScrollView contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>
                <AppMediumText style={styles.title}>{article.title}</AppMediumText>

                <View style={styles.dateBox}>
                    <View style={styles.postedBox}>
                        <Icon name="clock-outline" color="#608EC1" size={RFPercentage(3)} />
                        <AppText style={styles.postedText}>
                            Posted on {format(new Date(article.createdAt), "MMM dd, yyyy")}
                        </AppText>
                    </View>
                    <View style={[styles.deadlineBox, { marginLeft: RFPercentage(2) }]}>
                        <Icon name="clock-outline" color="#102F55" size={RFPercentage(3)} />
                        <AppText style={styles.deadlineText}>
                            Deadline: {format(new Date(article.deadline), "MMM dd, yyyy")}
                        </AppText>
                    </View>
                </View>

                {article.articleType === "VIDEO" ? (
                    <>
                        <YoutubePlayer
                            play={playing}
                            videoId={"iee2TATGMyI"}
                            height={RFPercentage(30)}
                            onChangeState={onStateChange}
                        />

                        <View style={styles.responseRow}>
                            <TouchableOpacity
                                onPress={() => setResponseType("textual")}
                                style={[
                                    styles.responseOption,
                                    { backgroundColor: responseType === "textual" ? theme.colors.primary : "#D8D8D8" },
                                ]}>
                                <AppMediumText
                                    style={[
                                        styles.optionText,
                                        { color: responseType === "textual" ? "#fff" : "#333" },
                                    ]}>
                                    Textual
                                </AppMediumText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setResponseType("audio")}
                                style={[
                                    styles.responseOption,
                                    { backgroundColor: responseType === "audio" ? theme.colors.primary : "#D8D8D8" },
                                ]}>
                                <AppMediumText
                                    style={[styles.optionText, { color: responseType === "audio" ? "#fff" : "#333" }]}>
                                    Audio
                                </AppMediumText>
                            </TouchableOpacity>
                        </View>

                        {responseType === "textual" ? renderSummaryForm() : renderAudioForm()}
                    </>
                ) : (
                    <>
                        {article.featuredImage ? (
                            <View style={styles.featureImageBox}>
                                <Image style={styles.featureImage} source={{ uri: article.featuredImage }} />
                            </View>
                        ) : null}

                        <AppText style={styles.body}>
                            <HTML
                                emSize={16}
                                contentWidth={contentWidth}
                                source={{ html: article.content }}
                                baseFontStyle={{ fontSize: RFPercentage(2.1) }}
                            />
                        </AppText>

                        {renderSummaryForm()}
                    </>
                )}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>Article</AppText>
                </View>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
        fontSize: RFPercentage(2.5),
    },
    dateBox: {
        alignItems: "center",
        flexDirection: "row",
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(3),
    },
    postedBox: {
        alignItems: "center",
        flexDirection: "row",
    },
    postedText: {
        color: "#608EC1",
        marginLeft: 4,
        fontSize: RFPercentage(1.8),
    },
    deadlineBox: {
        alignItems: "center",
        flexDirection: "row",
    },
    deadlineText: {
        color: "#102F55",
        marginLeft: 4,
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
    wordCountText: {
        marginBottom: 5,
        marginTop: RFPercentage(2),
    },
    summaryInput: {
        color: "#000",
        borderWidth: 1,
        borderColor: "#7A7A7A",
        height: RFPercentage(20),
        textAlignVertical: "top",
        fontSize: RFPercentage(2.1),
        fontFamily: "Baloo2-Regular",
        padding: RFPercentage(1.5),
    },
    note: {
        marginTop: RFPercentage(2),
        lineHeight: RFPercentage(2.2),
        fontSize: RFPercentage(1.8),
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
        marginTop: RFPercentage(3),
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
});
