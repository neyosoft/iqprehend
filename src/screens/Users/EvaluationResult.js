import React from "react";
import { useQuery } from "react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { debugAxiosError } from "../../utils/request.utils";
import { AppMediumText, AppText, PageLoading, Button } from "../../components";
import { PlagiarismIcon, GrammarIcon, ExpertIcon, VoteIcon } from "../../icons";

export const EvaluationResult = ({ navigation, route }) => {
    const { articleID } = route.params;

    const { authenticatedRequest } = useAuth();

    const summaryResponse = useQuery(["articles-summary", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary/detail", { params: { article: articleID } });

            if (data && data.data) {
                return data.data.summary;
            } else {
                throw new Error();
            }
        } catch (error) {
            debugAxiosError(error);
            throw new Error();
        }
    });

    const resultResponse = useQuery(["result", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/articles/leaderboard", {
                params: { id: articleID },
            });

            if (data && data.data) {
                return data.data.leaderboard;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const renderSummaryResult = () => {
        if (summaryResponse.isLoading || resultResponse.isLoading) {
            return <PageLoading />;
        }

        if (summaryResponse.isError || resultResponse.isError) {
            return (
                <View style={styles.center}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText>There is a problem retrieving result.</AppText>

                    <Button
                        label="Retry"
                        style={{ marginTop: RFPercentage(5) }}
                        onPress={() => {
                            resultResponse.refetch();
                            summaryResponse.refetch();
                        }}
                    />
                </View>
            );
        }

        const results = resultResponse.data;
        const summary = summaryResponse.data;

        return (
            <ScrollView style={styles.scrollview} contentContainerStyle={styles.contentContainerStyle}>
                <AppMediumText style={styles.title}>{summary.article.title}</AppMediumText>

                <View>
                    <View style={styles.sectionHead}>
                        <AppText style={styles.sectionText}>Break Down</AppText>
                    </View>

                    <View style={styles.box}>
                        <View style={[styles.eachBox, { backgroundColor: "#FAEAEA" }]}>
                            <View style={styles.titleRow}>
                                <AppText style={[styles.sectionTitle, { color: "#CF2A2A" }]}>Plagiarism</AppText>
                                <PlagiarismIcon />
                            </View>
                            <AppMediumText style={[styles.sectionPercentage, { color: "#CF2A2A" }]}>
                                {summary?.plagiarism?.score}
                            </AppMediumText>
                        </View>
                        <View style={[styles.eachBox, { backgroundColor: "#E6F8E8" }]}>
                            <View style={styles.titleRow}>
                                <AppText style={[styles.sectionTitle, { color: "#07BA" }]}>Grammar</AppText>
                                <GrammarIcon />
                            </View>
                            <AppMediumText style={[styles.sectionPercentage, { color: "#07BA" }]}>
                                {summary?.grammar?.score}
                            </AppMediumText>
                        </View>
                    </View>

                    <View style={[styles.box, { marginTop: RFPercentage(2) }]}>
                        <View style={[styles.eachBox, { backgroundColor: "#EAEDF8" }]}>
                            <View style={styles.titleRow}>
                                <AppText style={[styles.sectionTitle, { color: "#3050B9" }]}>Expert</AppText>
                                <ExpertIcon />
                            </View>
                            <AppMediumText style={[styles.sectionPercentage, { color: "#3050B9" }]}>
                                {summary?.expert?.score}
                            </AppMediumText>
                        </View>
                        <View style={[styles.eachBox, { backgroundColor: "#FFF7EA" }]}>
                            <View style={styles.titleRow}>
                                <AppText style={[styles.sectionTitle, { color: "#FFAC30" }]}>Votes</AppText>
                                <VoteIcon />
                            </View>
                            <AppMediumText style={[styles.sectionPercentage, { color: "#FFAC30" }]}>
                                {summary?.voting?.score}
                            </AppMediumText>
                        </View>
                    </View>

                    <View style={styles.totalRow}>
                        <AppMediumText style={[styles.totalRowText]}>Total</AppMediumText>
                        <AppMediumText style={[styles.totalRowText]}>
                            {summary?.plagiarism?.score +
                                summary?.grammar?.score +
                                summary?.expert?.score +
                                summary?.voting?.score}
                            %
                        </AppMediumText>
                    </View>
                </View>

                <View>
                    <View style={styles.sectionHead}>
                        <AppText style={styles.sectionText}>Leaders Board</AppText>
                    </View>

                    {results.map((record, index) => {
                        return (
                            <View style={styles.leaderRow} key={`index-${index}`}>
                                <View style={styles.leaderImageWrapper}>
                                    <Image
                                        style={styles.leaderImage}
                                        source={
                                            record.profilePicture
                                                ? { uri: record.profilePicture }
                                                : require("../../assets/images/avatar.jpg")
                                        }
                                    />
                                </View>

                                <AppText style={styles.leaderName}>
                                    {record.firstName} {record.lastName}
                                </AppText>
                                <AppText>{record.score}%</AppText>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>Evaluation</AppText>
            </View>

            {renderSummaryResult()}
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
    center: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    content: {
        padding: RFPercentage(3),
    },
    scrollview: {
        flex: 1,
        backgroundColor: "#fff",
    },
    contentContainerStyle: {
        padding: RFPercentage(3),
    },
    title: {
        fontSize: RFPercentage(2.5),
        marginBottom: RFPercentage(1),
    },
    sectionHead: {
        padding: RFPercentage(1),
        marginTop: RFPercentage(3),
        paddingHorizontal: RFPercentage(2),
        backgroundColor: theme.colors.primary,
    },
    sectionText: {
        color: "#fff",
        fontSize: RFPercentage(2),
    },
    box: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    eachBox: {
        width: "48%",
        padding: RFPercentage(2),
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontSize: RFPercentage(2.2),
    },
    sectionPercentage: {
        marginTop: RFPercentage(3),
        fontSize: RFPercentage(3),
    },
    totalRow: {
        flexDirection: "row",
        marginTop: RFPercentage(3),
        justifyContent: "space-between",
        paddingVertical: RFPercentage(1),
        backgroundColor: "gray",
        paddingHorizontal: RFPercentage(2),
    },
    totalRowText: {
        color: "#fff",
        fontSize: RFPercentage(3),
    },
    leaderRow: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#7787",
        paddingVertical: RFPercentage(1),
    },
    leaderImageWrapper: {
        overflow: "hidden",
        width: RFPercentage(6),
        height: RFPercentage(6),
        borderRadius: RFPercentage(4),
    },
    leaderImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    leaderName: {
        flex: 1,
        marginLeft: RFPercentage(2),
    },
});
