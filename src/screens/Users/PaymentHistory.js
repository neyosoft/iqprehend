import React from "react";
import format from "date-fns/format";
import { useQuery } from "react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { moneyFormat } from "../../utils/money.utils";
import { AppMediumText, AppText, Button, PageLoading } from "../../components";

export const PaymentHistory = ({ navigation }) => {
    const { authenticatedRequest } = useAuth();

    const historyResponse = useQuery("history", async () => {
        const { data } = await authenticatedRequest().get("/payment/my-subscriptions");

        if (data && data.data) {
            return data.data.subscriptions;
        } else {
            throw new Error("Unable to retrieve payment history");
        }
    });

    const renderContent = () => {
        if (historyResponse.isLoading) {
            return <PageLoading />;
        }

        if (historyResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText style={{ width: "70%", alignSelf: "center", textAlign: "center", marginTop: 20 }}>
                        Unable to retrieve payment history
                    </AppText>

                    <Button
                        label="Try again"
                        onPress={historyResponse.refetch}
                        style={{ marginTop: RFPercentage(5) }}
                    />
                </View>
            );
        }

        const history = historyResponse.data;

        return (
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                {history.map((record) => (
                    <View key={record._id} style={[styles.card, { marginTop: RFPercentage(2) }]}>
                        <View style={styles.cardHeader}>
                            <AppText style={styles.cardHeaderText}>
                                {format(new Date(record.updatedAt), "MMM do, yyyy")}
                            </AppText>
                        </View>
                        <View style={styles.cardContent}>
                            <View style={styles.cardContentRow}>
                                <AppText>Plan</AppText>
                                <AppMediumText>{record?.plan?.name}</AppMediumText>
                            </View>
                            <View style={styles.cardContentRow}>
                                <AppText>Duration</AppText>
                                <AppMediumText>{record?.plan?.duration}</AppMediumText>
                            </View>
                            <View style={styles.cardContentRow}>
                                <AppText>Amount</AppText>
                                <AppMediumText>{moneyFormat(record.amount)}</AppMediumText>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                    </TouchableOpacity>

                    <AppText style={styles.headerTitle}>Payment History</AppText>
                </View>

                {renderContent()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#C7C7C7",
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
    contentContainerStyle: {
        padding: RFPercentage(3),
    },
    card: {
        borderRadius: 5,
        overflow: "hidden",
        backgroundColor: "#fff",
        paddingBottom: RFPercentage(2),
    },
    cardHeader: {
        alignItems: "center",
        paddingVertical: RFPercentage(2),
        backgroundColor: theme.colors.primary,
    },
    cardHeaderText: {
        color: "#fff",
    },
    cardContent: {
        paddingTop: RFPercentage(2),
        paddingHorizontal: RFPercentage(2),
    },
    cardContentRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: RFPercentage(1),
        justifyContent: "space-between",
    },
    checkbox: {
        paddingVertical: 4,
    },
    planPrice: {
        fontSize: RFPercentage(4),
        textAlign: "center",
        marginVertical: 10,
    },
    proceedBtn: {
        marginTop: 10,
    },
});
