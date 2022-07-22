import React from "react";
import { useQuery } from "react-query";
import PieChart from "react-native-pie-chart";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, Image, TouchableWithoutFeedback } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { AppMediumText, AppText, Button, HeaderWithBack, PageLoading } from "../../components";

export const SummaryResult = ({ navigation, route }) => {
    const { user, authenticatedRequest } = useAuth();

    const { articleID } = route.params;

    const summaryResponse = useQuery(["summary", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary/detail", { params: { article: articleID } });

            if (data?.data?.summary) {
                return data.data.summary;
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

    const renderContent = () => {
        if (summaryResponse.isLoading || summaryResponse.isFetching) {
            return <PageLoading />;
        }

        if (summaryResponse.isError) {
            return (
                <View style={styles.centeredView}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText style={styles.errorLabel}>There is a problem retrieving result. Kindly try again.</AppText>

                    <Button label="Retry" style={{ marginTop: RFPercentage(5) }} onPress={summaryResponse.refetch} />
                </View>
            );
        }

        const summary = summaryResponse.data;

        const essayScore = summary?.essay?.score;
        const grammarScore = summary?.grammar?.score;
        const plagiarismScore = summary?.plagiarism?.score;

        const totalScore = Number(essayScore) + Number(grammarScore) + Number(plagiarismScore);

        const widthAndHeight = RFPercentage(30);
        const sliceColor = ["#C3EDFF", "#060169", "#676668"];
        const series = [essayScore || 1, plagiarismScore || 1, grammarScore || 1];

        return (
            <ScrollView>
                <View style={styles.topBox}>
                    <View style={styles.headerPhotoWrapper}>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate("Settings")}>
                            <Image
                                style={styles.headerPhoto}
                                source={
                                    user?.profilePicture
                                        ? { uri: user.profilePicture }
                                        : require("../../assets/images/avatar.jpg")
                                }
                            />
                        </TouchableWithoutFeedback>
                    </View>
                    <AppMediumText style={styles.title}>{summary.article.title}</AppMediumText>

                    <View style={styles.chartWrapper}>
                        <PieChart series={series} sliceColor={sliceColor} widthAndHeight={widthAndHeight} />

                        <AppMediumText style={styles.scoreLabel}>SCORE: {totalScore.toFixed(2)}%</AppMediumText>
                    </View>
                </View>
                <View style={styles.bottomBox}>
                    <View style={styles.evaluationRow}>
                        <View style={styles.evaluationIndicator} />
                        <AppText style={styles.evaluationLabel}>Grammar Check: {grammarScore}</AppText>
                    </View>
                    <View style={styles.evaluationRow}>
                        <View style={[styles.evaluationIndicator, { backgroundColor: "#060169" }]} />
                        <AppText style={styles.evaluationLabel}>Plagiarism Check: {plagiarismScore}</AppText>
                    </View>
                    <View style={styles.evaluationRow}>
                        <View style={[styles.evaluationIndicator, { backgroundColor: "#C3EDFF" }]} />
                        <AppText style={styles.evaluationLabel}>Coherence Score: {essayScore}</AppText>
                    </View>
                    <Button
                        style={styles.button}
                        label="VIEW LEADERBOARD"
                        onPress={() => navigation.navigate("LeadersBoard", { articleID })}
                    />
                </View>
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        padding: RFPercentage(4),
    },
    topBox: {
        padding: RFPercentage(4),
        backgroundColor: "#F4F4F4",
    },
    title: {
        color: theme.colors.primary,
        fontSize: RFPercentage(3),
        marginTop: RFPercentage(2),
    },
    headerPhotoWrapper: {
        alignSelf: "flex-end",
    },
    headerPhoto: {
        width: RFPercentage(6),
        height: RFPercentage(6),
        borderRadius: RFPercentage(6),
    },
    chartWrapper: {
        alignItems: "center",
        marginTop: RFPercentage(4),
    },
    scoreLabel: {
        marginTop: RFPercentage(2),
        fontSize: RFPercentage(2.5),
        color: theme.colors.primary,
    },
    bottomBox: {
        backgroundColor: "#FFF",
        padding: RFPercentage(4),
    },
    evaluationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: RFPercentage(3),
    },
    evaluationIndicator: {
        width: RFPercentage(4),
        height: RFPercentage(4),
        backgroundColor: "#676668",
    },
    evaluationLabel: {
        marginLeft: RFPercentage(2),
        fontSize: RFPercentage(2.5),
        color: theme.colors.primary,
    },
    button: {
        marginTop: RFPercentage(2),
    },
});
