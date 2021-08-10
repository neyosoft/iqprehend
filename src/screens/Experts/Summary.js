import { useQuery } from "react-query";
import React, { useState, useRef } from "react";
import { useToast } from "react-native-fast-toast";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

import theme from "../../theme";
import { useAuth } from "../../context";
import { extractResponseErrorMessage } from "../../utils/request.utils";
import { AppMediumText, AppText, AppTextField, Button, PageLoading } from "../../components";
import { RecordIcon } from "../../icons";

export const Summary = ({ navigation, route }) => {
    const toast = useToast();
    const audioRef = useRef(new AudioRecorderPlayer());

    const { authenticatedRequest } = useAuth();

    const [score, setScore] = useState("");
    const [maxScore, setMaxScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState("00:00:00");
    const [submitting, setSubmitting] = useState(false);

    const { summaryID } = route.params;

    const summaryResponse = useQuery(["summary", summaryID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary/single", { params: { id: summaryID } });

            if (data && data.data) {
                setScore(data.data?.summary?.expert?.score ? `${data.data.summary.expert.score}` : "");

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
                if (data.data?.scoring?.expertCheck) {
                    setMaxScore(data.data.scoring.expertCheck);
                }
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
            settingsResponse.refetch();
        }, []),
    );

    const startPlaying = async () => {
        setIsPlaying(true);

        await audioRef.current.startPlayer(summaryResponse.data.audioContent);
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

    const handleSubmit = async () => {
        if (!score) {
            return toast.show("Score is required.");
        }

        if (parseInt(score) > parseInt(maxScore)) {
            return toast.show("Score exceeds maximum possible score.");
        }

        try {
            setSubmitting(true);

            const { data } = await authenticatedRequest().put("/summary/expert-review", {
                id: summaryID,
                score: parseInt(score),
            });

            if (data && data.data) {
                toast.show(data.data.message);

                navigation.goBack();
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));

            setSubmitting(false);
        }
    };

    const renderContent = () => {
        if (summaryResponse.isLoading || settingsResponse.isLoading) {
            return <PageLoading />;
        }

        if (summaryResponse.isError || settingsResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText>There is a problem retrieving summary detail.</AppText>

                    <Button
                        label="Retry"
                        style={{ marginTop: RFPercentage(5) }}
                        onPress={() => {
                            summaryResponse.refetch();
                            settingsResponse.refetch();
                        }}
                    />
                </View>
            );
        }

        const summary = summaryResponse.data;
        const settings = settingsResponse.data;

        return (
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                <AppMediumText style={styles.title}>Summary details</AppMediumText>

                {summary.content ? (
                    <View style={styles.summaryWrapper}>
                        <AppText style={styles.summary}>{summary.content}</AppText>
                    </View>
                ) : null}

                {summary.audioContent ? (
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
                    </View>
                ) : null}

                <AppTextField
                    value={score}
                    label="Score"
                    placeholder="20"
                    onChangeText={setScore}
                    keyboardType="number-pad"
                    style={styles.scoreInput}
                />

                <AppText style={styles.note}>
                    <AppMediumText>Note:</AppMediumText> Maximum summary score is {settings?.scoring?.expertCheck}
                </AppText>

                <Button
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={submitting || summary?.expert}
                    label={submitting ? "Processing..." : "Submit"}
                />
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
                    <AppText style={styles.headerTitle}>Summary</AppText>
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
        marginBottom: RFPercentage(1),
    },
    summaryWrapper: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#E5E5E5",
        marginTop: RFPercentage(2),
        paddingVertical: RFPercentage(2),
    },
    summary: {
        lineHeight: RFPercentage(3),
    },
    scoreInput: {
        marginTop: RFPercentage(3),
    },
    note: {
        fontSize: RFPercentage(1.8),
        marginTop: RFPercentage(1),
    },
    audiobox: {
        width: "90%",
        alignSelf: "center",
        alignItems: "center",
        marginTop: RFPercentage(6),
    },
    startBtn: {
        backgroundColor: "#05B54B",
        paddingVertical: RFPercentage(1),
        marginBottom: RFPercentage(2),
    },
    button: {
        marginTop: RFPercentage(5),
    },
});
