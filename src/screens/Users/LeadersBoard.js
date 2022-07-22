import React from "react";
import { useQuery } from "react-query";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, Image, TouchableWithoutFeedback } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { AppMediumText, AppText, Button, HeaderWithBack, PageLoading } from "../../components";

export const LeadersBoard = ({ navigation, route }) => {
    const { user, authenticatedRequest } = useAuth();

    const { articleID } = route.params;

    const leadersboardResponse = useQuery(["leadersboard", articleID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/articles/leaderboard", {
                params: { id: articleID },
            });

            if (data?.data?.leaderboard) {
                return data.data.leaderboard;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    useFocusEffect(
        React.useCallback(() => {
            leadersboardResponse.refetch();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    );

    const renderContent = () => {
        if (leadersboardResponse.isLoading || leadersboardResponse.isFetching) {
            return <PageLoading />;
        }

        if (leadersboardResponse.isError) {
            return (
                <View style={styles.centeredView}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText style={styles.errorLabel}>
                        There is a problem retrieving leaderboard. Kindly try again.
                    </AppText>

                    <Button
                        label="Retry"
                        style={{ marginTop: RFPercentage(5) }}
                        onPress={leadersboardResponse.refetch}
                    />
                </View>
            );
        }

        const leaders = leadersboardResponse.data;

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
                </View>
                <View style={styles.bottomBox}>
                    <AppMediumText style={styles.title}>Leaderboard</AppMediumText>

                    {leaders.map((record) => (
                        <View style={styles.leaderCard}>
                            <Image
                                style={styles.headerPhoto}
                                source={
                                    record?.profilePicture
                                        ? { uri: user.profilePicture }
                                        : require("../../assets/images/avatar.jpg")
                                }
                            />
                            <AppText style={styles.leaderName}>
                                {record.firstName} {record.lastName}
                            </AppText>
                            <AppText style={styles.leaderScore}>{record.score}%</AppText>
                        </View>
                    ))}
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
    bottomBox: {
        padding: RFPercentage(4),
        paddingVertical: RFPercentage(2),
        backgroundColor: "#FFF",
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
    leaderCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: RFPercentage(1),
        borderBottomColor: "#eee",
        marginTop: RFPercentage(1),
    },
    leaderName: {
        flex: 1,
        color: theme.colors.primary,
        marginHorizontal: RFPercentage(2),
    },
    leaderScore: {
        color: theme.colors.primary,
    },
    button: {
        marginTop: RFPercentage(2),
    },
});
