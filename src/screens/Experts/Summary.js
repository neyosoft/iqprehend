import { useQuery } from "react-query";
import React, { useState } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { AppMediumText, AppText, AppTextField, Button, PageLoading } from "../../components";

export const Summary = ({ navigation, route }) => {
    const { authenticatedRequest } = useAuth();

    const [score, setScore] = useState("");

    const { summaryID } = route.params;

    const summaryResponse = useQuery(["summary", summaryID], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary/single", { params: { id: summaryID } });

            if (data && data.data) {
                return data.data.summary;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const handleSubmit = async () => {};

    const renderContent = () => {
        if (summaryResponse.isLoading) {
            return <PageLoading />;
        }

        if (summaryResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText>There is a problem retrieveing summary detail.</AppText>

                    <Button label="Retry" style={{ marginTop: RFPercentage(5) }} onPress={summaryResponse.refetch} />
                </View>
            );
        }

        const summary = summaryResponse.data;

        return (
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                <AppMediumText style={styles.title}>Summary details</AppMediumText>

                <View style={styles.summaryWrapper}>
                    <AppText style={styles.summary}>{summary.content}</AppText>
                </View>

                <AppTextField
                    value={score}
                    label="Score"
                    placeholder="20"
                    onChangeText={setScore}
                    keyboardType="number-pad"
                    style={styles.scoreInput}
                />

                <AppText style={styles.note}>
                    <AppMediumText>Note:</AppMediumText> Maximum summary score is 35
                </AppText>

                <Button label="Submit" style={styles.button} onPress={handleSubmit} />
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>Summary</AppText>
            </View>

            {renderContent()}
        </View>
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
    button: {
        marginTop: RFPercentage(5),
    },
});
