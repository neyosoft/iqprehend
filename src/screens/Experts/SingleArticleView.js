import React, { useState, useCallback } from "react";
import format from "date-fns/format";
import { useQuery } from "react-query";
import HTML from "react-native-render-html";
import YoutubePlayer from "react-native-youtube-iframe";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, useWindowDimensions } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { AppMediumText, AppText, Button, PageLoading } from "../../components";

export const SingleArticleView = ({ navigation, route }) => {
    const { articleID } = route.params;

    const { authenticatedRequest } = useAuth();
    const contentWidth = useWindowDimensions().width;

    const [playing, setPlaying] = useState(false);

    const articlesResponse = useQuery(["article", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/articles/single", { params: { id: articleID } });

            if (data && data.data) {
                return data.data.article;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const summaryResponse = useQuery(["article-summaries", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/articles/summaries", {
                params: { id: articleID },
            });

            if (data && data.data) {
                return data.data.summaries;
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
            articlesResponse.refetch();
        }, []),
    );

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

    const renderUserSummaries = ({ item }) => <SummaryCard summary={item} navigation={navigation} />;

    const renderContent = () => {
        if (articlesResponse.isLoading || summaryResponse.isLoading) {
            return <PageLoading />;
        }

        if (articlesResponse.isError || summaryResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText>There is a problem retrieveing article summaries.</AppText>

                    <Button
                        label="Retry"
                        style={{ marginTop: RFPercentage(5) }}
                        onPress={() => {
                            summaryResponse.refetch();
                            articlesResponse.refetch();
                        }}
                    />
                </View>
            );
        }

        const article = articlesResponse.data;
        const summaries = summaryResponse.data;

        console.log({ summaries });

        return (
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
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
                    </>
                )}

                <View style={styles.summaryUserBox}>
                    <AppMediumText style={styles.summaryTitle}>Summaries</AppMediumText>
                    <FlatList data={summaries} keyExtractor={(item) => item._id} renderItem={renderUserSummaries} />
                </View>
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>Article summaries</AppText>
            </View>

            {renderContent()}
        </View>
    );
};

const SummaryCard = ({ summary, navigation }) => {
    console.log("summary info: ", summary);

    return (
        <TouchableOpacity
            style={styles.summaryUserCard}
            onPress={() => navigation.navigate("Summary", { summaryID: summary._id })}>
            <View style={styles.summaryUserImageContainer}>
                <Image
                    style={styles.summaryUserImage}
                    source={
                        summary?.user?.profilePicture
                            ? { uri: summary.user.profilePicture }
                            : require("../../assets/images/avatar.jpg")
                    }
                />
            </View>
            <View style={styles.summaryUserCardRight}>
                <View style={styles.detailRow}>
                    <AppMediumText style={styles.summaryUserCardLabel}>Name</AppMediumText>
                    <AppText>{`${summary?.user?.lastName} ${summary?.user?.firstName}`}</AppText>
                </View>
                <View style={styles.detailRow}>
                    <AppMediumText style={styles.summaryUserCardLabel}>Email</AppMediumText>
                    <AppText>{summary?.user?.email}</AppText>
                </View>
                <View style={styles.detailRow}>
                    <AppMediumText style={styles.summaryUserCardLabel}>Status</AppMediumText>
                    <AppText>{summary?.isExpertReviewed ? "Reviewed completed." : "Not yet reviewed"}</AppText>
                </View>
            </View>
        </TouchableOpacity>
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
    summaryUserBox: {
        marginTop: RFPercentage(3),
    },
    summaryTitle: {
        fontSize: RFPercentage(2.3),
    },
    summaryUserCard: {
        elevation: 3,
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: RFPercentage(2),
        borderRadius: theme.radius.card,
        marginTop: RFPercentage(2),
    },
    summaryUserImageContainer: {
        overflow: "hidden",
        width: RFPercentage(10),
        height: RFPercentage(10),
        borderRadius: RFPercentage(6),
    },
    summaryUserImage: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    summaryUserCardRight: {
        flex: 1,
        marginLeft: RFPercentage(2),
    },
    detailRow: {
        marginTop: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    summaryUserCardLabel: {
        width: RFPercentage(7),
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
