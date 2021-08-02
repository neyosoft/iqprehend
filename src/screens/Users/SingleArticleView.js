import React, { useState, useCallback, useRef } from "react";
import { useQuery } from "react-query";
import { format, isFuture } from "date-fns";
import HTML from "react-native-render-html";
import { useToast } from "react-native-fast-toast";
import YoutubePlayer from "react-native-youtube-iframe";
import DocumentPicker from "react-native-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AudioRecorderPlayer, {
    AVEncodingOption,
    AudioSourceAndroidType,
    AudioEncoderAndroidType,
    AVEncoderAudioQualityIOSType,
} from "react-native-audio-recorder-player";
import {
    View,
    Image,
    Platform,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useWindowDimensions,
    PermissionsAndroid,
} from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { RecordIcon } from "../../icons";
import { AppMediumText, AppText, Button, PageLoading } from "../../components";
import { extractResponseErrorMessage } from "../../utils/request.utils";
import { useFocusEffect } from "@react-navigation/native";

const wordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(" ").length;
};

export const SingleArticleView = ({ navigation, route }) => {
    const audioRef = useRef(new AudioRecorderPlayer());
    const toast = useToast();
    const { authenticatedRequest } = useAuth();

    const contentWidth = useWindowDimensions().width;

    const [playing, setPlaying] = useState(false);
    const [summaryText, setSummaryText] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState("00:00:00");
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

            if (data && data.data && data.data.article) {
                return data.data.article;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const articlesSummaryResponse = useQuery(["articles-summary", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary/detail", { params: { article: articleID } });

            if (data && data.data) {
                console.log("summary: ", data.data.summary);

                setSummaryText(data.data?.summary?.content || "");

                if (data.data?.summary?.audioContent) {
                    setResponseType("audio");
                }

                return data.data.summary;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const settingsResponse = useQuery(["settings"], async () => {
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

    useFocusEffect(
        React.useCallback(() => {
            settingsResponse.refetch();
            articlesResponse.refetch();
            articlesSummaryResponse.refetch();
        }, []),
    );

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

            console.log("data: ", data);

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

    const handleSummaryAudioSubmission = async (file) => {
        try {
            const formData = new FormData();

            formData.append("audio-content", file);

            if (articlesSummaryResponse.data) {
                formData.append("id", articlesSummaryResponse.data._id);
            } else {
                formData.append("article", articleID);
            }

            setIsSubmitting(true);

            const { data } = articlesSummaryResponse.data
                ? await authenticatedRequest().put("/summary", formData, {
                      headers: {
                          "Content-Type": "multipart/form-data",
                      },
                  })
                : await authenticatedRequest().post("/summary", formData, {
                      headers: {
                          "Content-Type": "multipart/form-data",
                      },
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

    const handleAudioPicker = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
            });

            const maxFileSize = 5 * 1024 * 1024;

            if (res.size > maxFileSize) {
                return toast.show("File selected exceeded maximum file size.");
            }

            await handleSummaryAudioSubmission(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    };

    const startRecording = async () => {
        if (Platform.OS === "android") {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);

                console.log("write external stroage", grants);

                if (
                    grants["android.permission.WRITE_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED &&
                    grants["android.permission.READ_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED &&
                    grants["android.permission.RECORD_AUDIO"] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log("permissions granted");
                } else {
                    console.log("All required permissions not granted");
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
        }

        const audioSet = {
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        };

        setIsRecording(true);

        await audioRef.current.startRecorder(undefined, audioSet);

        audioRef.current.addRecordBackListener((e) => {
            setDuration(audioRef.current.mmssss(Math.floor(e.currentPosition)));
        });
    };

    const stopRecording = async () => {
        const result = await audioRef.current.stopRecorder();
        audioRef.current.removeRecordBackListener();

        setIsRecording(false);

        await handleSummaryAudioSubmission({
            uri: result,
            type: Platform.OS === "android" ? "audio/mp4" : "audio/m4a",
            name: Platform.OS === "android" ? "summary.mp4" : "summary.m4a",
        });
    };

    const startPlaying = async () => {
        setIsPlaying(true);

        await audioRef.current.startPlayer(articlesSummaryResponse.data.audioContent);
        await audioRef.current.setVolume(1.0);

        audioRef.current.addPlayBackListener((e) => {
            setDuration(audioRef.current.mmssss(Math.floor(e.currentPosition)));

            if (e.currentPosition === e.duration) {
                setIsPlaying(false);
            }
        });
    };

    const stopPlaying = () => {
        setIsPlaying(false);

        audioRef.current.stopPlayer();
        audioRef.current.removePlayBackListener();

        setDuration(audioRef.current.mmssss(0));
    };

    const renderSummaryForm = () => {
        const settingsConfig = settingsResponse.data;
        const summaryMaxWordCount = settingsConfig?.summary?.count || 200;

        return (
            <View>
                {isFuture(new Date(articlesResponse.data.deadline)) ? (
                    <>
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
                    </>
                ) : (
                    <View>
                        <View
                            style={{
                                borderColor: "gray",
                                marginTop: RFPercentage(3),
                                paddingBottom: RFPercentage(2),
                                marginBottom: RFPercentage(2),
                                borderTopWidth: StyleSheet.hairlineWidth,
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}>
                            <AppMediumText style={styles.wordCountText}>Your Summary</AppMediumText>
                            <AppText style={styles.note}>{summaryText}</AppText>
                        </View>
                        {articlesSummaryResponse.data?.isExpertReviewed && articlesSummaryResponse.data?.linkId ? (
                            <View>
                                <AppText>Sharable Link</AppText>
                                <TouchableOpacity
                                    style={styles.linkWrapper}
                                    onPress={() =>
                                        navigation.navigate("Voting", { linkId: articlesSummaryResponse.data.linkId })
                                    }>
                                    <AppText style={styles.link}>
                                        http://www.iqprehend.com/{articlesSummaryResponse.data.linkId}
                                    </AppText>
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>
                )}
            </View>
        );
    };

    const renderAudioForm = () => (
        <View>
            {isFuture(new Date(articlesResponse.data.deadline)) ? (
                <View style={styles.audiobox}>
                    <RecordIcon style={{ marginBottom: RFPercentage(2) }} />

                    <AppMediumText style={{ marginBottom: 10 }}>{duration}</AppMediumText>

                    <Button
                        style={styles.startBtn}
                        disabled={isSubmitting}
                        label={isRecording ? "STOP RECORDING" : "RECORD"}
                        onPress={() => {
                            if (isRecording) {
                                stopRecording();
                            } else {
                                startRecording();
                            }
                        }}
                    />
                    {articlesSummaryResponse.data?.audioContent ? (
                        <Button
                            disabled={isSubmitting}
                            label={isPlaying ? "STOP" : "PLAY"}
                            style={[styles.startBtn, { backgroundColor: theme.colors.primary }]}
                            onPress={() => {
                                isPlaying ? stopPlaying() : startPlaying();
                            }}
                        />
                    ) : null}

                    <AppText style={styles.note}>
                        <AppMediumText>Note:</AppMediumText> Accepted file format: mp3, wav, aac,ogg. Maximum file is
                        5MB
                    </AppText>

                    <Button
                        disabled={isSubmitting}
                        style={styles.uploadBtn}
                        onPress={handleAudioPicker}
                        label={isSubmitting ? "UPLOADING..." : "UPLOAD"}
                    />
                </View>
            ) : (
                <View style={styles.audiobox}>
                    <RecordIcon style={{ marginBottom: RFPercentage(2) }} />

                    <AppMediumText style={{ marginBottom: 10 }}>{duration}</AppMediumText>

                    <Button
                        label={isPlaying ? "STOP" : "PLAY"}
                        style={[styles.startBtn, { backgroundColor: theme.colors.primary }]}
                        onPress={() => {
                            isPlaying ? stopPlaying() : startPlaying();
                        }}
                    />

                    {articlesSummaryResponse.data?.isExpertReviewed ? (
                        <View>
                            <AppText>Sharable Link</AppText>
                            <View>
                                <AppText>http://www.iqprehend.com/v/384848</AppText>
                            </View>
                        </View>
                    ) : null}
                </View>
            )}
        </View>
    );

    const renderContent = () => {
        if (articlesResponse.isLoading || articlesSummaryResponse.isLoading || settingsResponse.isLoading) {
            return <PageLoading />;
        }

        if (articlesResponse.isError || articlesSummaryResponse.isError || settingsResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText>There is a problem retrieveing article.</AppText>

                    <Button
                        label="Retry"
                        style={{ marginTop: RFPercentage(5) }}
                        onPress={() => {
                            articlesResponse.refetch();
                            articlesSummaryResponse.refetch();
                        }}
                    />
                </View>
            );
        }

        const article = articlesResponse.data;

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
                            height={RFPercentage(30)}
                            onChangeState={onStateChange}
                            videoId={article.videoLink.replace("https://www.youtube.com/watch?v=", "")}
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

                        <View style={styles.body}>
                            <HTML
                                emSize={16}
                                contentWidth={contentWidth}
                                source={{ html: article.content }}
                                baseFontStyle={{ fontSize: RFPercentage(2.1), lineHeight: RFPercentage(3.3) }}
                            />
                        </View>

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
        height: RFPercentage(30),
        textAlignVertical: "top",
        fontSize: RFPercentage(2.1),
        padding: RFPercentage(1.5),
        fontFamily: "Baloo2-Regular",
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
    link: {
        color: "blue",
        lineHeight: 25,
        fontSize: RFPercentage(1.8),
        textDecorationLine: "underline",
    },
});
