import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import HTML from "react-native-render-html";
import { useToast } from "react-native-fast-toast";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, useWindowDimensions } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { VotingSuccessfulModal } from "../../modals";
import { AppMediumText, AppText, Button, PageLoading } from "../../components";
import { extractResponseErrorMessage } from "../../utils/request.utils";

export const Voting = ({ navigation, route }) => {
    const toast = useToast();
    const { user, authenticatedRequest } = useAuth();

    const contentWidth = useWindowDimensions().width;

    const { linkId } = route.params;

    const [modal, setModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const votingResponse = useQuery(["voting", linkId], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary/vote", { params: { linkId } });

            if (data && data.data) {
                return data.data.summary;
            } else {
                throw new Error("Unable to retreive summary information.");
            }
        } catch (error) {
            throw new Error("Unable to retreive summary information.");
        }
    });

    useFocusEffect(
        React.useCallback(() => {
            votingResponse.refetch();
        }, []),
    );

    useEffect(() => {
        if (!(user && user?.role === "USER")) {
            toast.show("You are not permitted to vote.");
            return navigation.goBack();
        }
    }, []);

    const submitVoting = async () => {
        try {
            setIsSubmitting(true);

            const { data } = await authenticatedRequest().put("/summary/vote", { linkId });

            if (data && data.data) {
                setModal(true);
            } else {
                throw new Error("There is a problem casting vote.");
            }
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        if (votingResponse.isLoading || votingResponse.isFetching) {
            return <PageLoading />;
        }

        if (votingResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText style={{ width: "70%", alignSelf: "center", textAlign: "center", marginTop: 20 }}>
                        There is a problem retrieving summary information.
                    </AppText>

                    <Button label="Retry" style={{ marginTop: RFPercentage(5) }} onPress={votingResponse.refetch} />
                </View>
            );
        }

        const info = votingResponse.data;

        return (
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainerStyle}>
                <View>
                    <AppMediumText style={styles.authorTitle}>Summary Author</AppMediumText>
                    <View style={styles.authorbox}>
                        <View style={styles.imageBox}>
                            <Image
                                style={styles.profileImage}
                                source={
                                    info.user?.profilePicture
                                        ? { uri: info.user.profilePicture }
                                        : require("../../assets/images/avatar.jpg")
                                }
                            />
                        </View>
                        <View style={styles.authorRight}>
                            <AppText style={styles.authorName}>
                                {info.user?.lastName} {info.user?.firstName}
                            </AppText>
                            <AppText style={styles.authorEmail}>{info.user?.email}</AppText>
                        </View>
                    </View>
                </View>
                <View>
                    <AppMediumText style={styles.title}>{info.article.title}</AppMediumText>
                    <HTML
                        emSize={16}
                        contentWidth={contentWidth}
                        source={{ html: info.article.content }}
                        baseFontStyle={{ fontSize: RFPercentage(2.1) }}
                    />
                </View>
                <View style={{ marginTop: RFPercentage(2) }}>
                    <AppMediumText style={styles.title}>Summary details</AppMediumText>
                    <AppText style={styles.articleBody}>{info.content}</AppText>
                </View>

                <View style={styles.btnBox}>
                    <Button
                        onPress={submitVoting}
                        label={isSubmitting ? "SUBMITTING..." : "VOTE SUMMARY"}
                        disabled={isSubmitting || (info.voters && info.voters.includes(user._id))}
                    />
                </View>
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
                    <AppText style={styles.headerTitle}>Voting</AppText>
                </View>

                {renderContent()}
            </View>

            <VotingSuccessfulModal
                show={modal}
                onClose={() => {
                    setModal(false);
                    navigation.goBack();
                }}
            />
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
        flex: 1,
    },
    contentContainerStyle: {
        padding: RFPercentage(3),
    },
    title: {
        color: theme.colors.primary,
        fontSize: RFPercentage(2.7),
    },
    authorTitle: {
        fontSize: RFPercentage(2.3),
    },
    authorbox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(3),
    },
    imageBox: {
        overflow: "hidden",
        width: RFPercentage(10),
        height: RFPercentage(10),
        borderRadius: RFPercentage(5),
    },
    profileImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    authorRight: {
        flex: 1,
        marginLeft: RFPercentage(2),
    },
    authorName: {
        fontSize: RFPercentage(2.5),
    },
    authorEmail: {
        fontSize: RFPercentage(1.8),
        color: theme.colors.diabledBtn,
    },
    articleBody: {
        lineHeight: 25,
        fontSize: RFPercentage(1.9),
        marginTop: RFPercentage(1),
    },
    btnBox: {
        alignItems: "center",
        marginTop: RFPercentage(10),
    },
});
