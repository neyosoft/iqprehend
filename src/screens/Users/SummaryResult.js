import React from "react";
import { useQuery } from "react-query";
import format from "date-fns/format";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, ScrollView, Image, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../../theme";
import { useAuth } from "../../context";
import { Header } from "./Home/components";
import { AppBoldText, AppMediumText, AppText, Button, PageLoading } from "../../components";

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
                    <AppText style={styles.errorLabel}>
                        There is a problem retrieving your subscription at the moment. Kindly try again.
                    </AppText>

                    <Button label="Retry" style={{ marginTop: RFPercentage(5) }} onPress={summaryResponse.refetch} />
                </View>
            );
        }

        const summary = summaryResponse.data;

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
                </View>
                <Button
                    style={styles.button}
                    label="VIEW LEADERBOARD"
                    onPress={() => navigation.navigate("PaymentHistory")}
                />
            </ScrollView>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={styles.root}>
            <View style={styles.container}>
                <Header />

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
    },
    headerPhotoWrapper: {
        alignSelf: "flex-end",
    },
    headerPhoto: {
        width: RFPercentage(6),
        height: RFPercentage(6),
        borderRadius: RFPercentage(6),
    },
    button: {
        marginTop: RFPercentage(2),
    },
});
