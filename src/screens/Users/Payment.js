import React, { useState } from "react";
import { useQuery } from "react-query";
import format from "date-fns/format";
import { isPast } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../../theme";
import { useAuth } from "../../context";
import { PaymentSuccessfulModal } from "../../modals/PaymentSuccessfulModal";
import { PaymentConfirmationModal } from "../../modals/PaymentConfirmationModal";
import { AppBoldText, AppMediumText, AppText, Button, PageLoading } from "../../components";

export const Payment = ({ navigation }) => {
    const { authenticatedRequest } = useAuth();

    const [modal, setModal] = useState(null);

    const paymentResponse = useQuery("payment", async () => {
        const { data } = await authenticatedRequest().get("/payment/current-subscription");

        if (data && data.data) {
            return data.data;
        } else {
            throw new Error("Unable to retreive payment information");
        }
    });

    useFocusEffect(
        React.useCallback(() => {
            paymentResponse.refetch();
        }, []),
    );

    const renderContent = () => {
        if (paymentResponse.isLoading || paymentResponse.isFetching) {
            return <PageLoading />;
        }

        if (paymentResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText style={{ width: "70%", alignSelf: "center", textAlign: "center", marginTop: 20 }}>
                        There is a problem retrieving your subscription at the moment. Kindly try again.
                    </AppText>

                    <Button label="Retry" style={{ marginTop: RFPercentage(5) }} onPress={paymentResponse.refetch} />
                </View>
            );
        }

        if (!paymentResponse.data?.planDetails || isPast(new Date(paymentResponse.data?.planDetails?.endDate))) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Image source={require("../../assets/images/information.png")} />
                    <AppBoldText style={styles.title}>No active subscription</AppBoldText>
                    <AppText style={styles.description}>You do not have an active subscription.</AppText>

                    <Button
                        label="Subscribe"
                        style={styles.button}
                        onPress={() => navigation.navigate("PaymentPlans")}
                    />
                </View>
            );
        }

        const plan = paymentResponse.data.planDetails;

        return (
            <ScrollView style={styles.content}>
                <AppMediumText style={styles.title}>Active Subscription</AppMediumText>

                <View style={styles.boxContainer}>
                    <View style={styles.itemRow}>
                        <AppMediumText style={[styles.item, { color: theme.colors.primary }]}>Type</AppMediumText>
                        <AppText style={styles.item}>{plan.name}</AppText>
                    </View>
                    <View style={styles.itemRow}>
                        <AppMediumText style={[styles.item, { color: theme.colors.primary }]}>Duration</AppMediumText>
                        <AppText style={styles.item}>{plan.duration}</AppText>
                    </View>
                    <View style={styles.itemRow}>
                        <AppMediumText style={[styles.item, { color: theme.colors.primary }]}>Start Date</AppMediumText>
                        <AppText style={styles.item}>{format(new Date(plan.startDate), "MMM dd, yyyy")}</AppText>
                    </View>
                    <View style={styles.itemRow}>
                        <AppMediumText style={[styles.item, { color: theme.colors.primary }]}>End Date</AppMediumText>
                        <AppText style={styles.item}>{format(new Date(plan.endDate), "MMM dd, yyyy")}</AppText>
                    </View>
                </View>

                <Button
                    style={styles.button}
                    label="View payment history"
                    onPress={() => navigation.navigate("PaymentHistory")}
                />
            </ScrollView>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigation.openDrawer}>
                        <Icon name="menu" color="#fff" size={RFPercentage(3.5)} />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>Payment</AppText>
                </View>

                {renderContent()}
            </View>

            <PaymentConfirmationModal
                show={modal === "confirm"}
                onClose={() => setModal(null)}
                onConfirm={() => setModal("success")}
            />
            <PaymentSuccessfulModal show={modal === "success"} onClose={() => setModal(null)} />
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
        padding: RFPercentage(4),
    },
    title: {
        fontSize: RFPercentage(2.7),
        marginTop: RFPercentage(1),
    },
    description: {
        marginTop: 5,
        fontSize: RFPercentage(2),
    },
    boxContainer: {
        marginTop: RFPercentage(2),
    },
    itemRow: {
        borderWidth: 1,
        flexDirection: "row",
        borderBottomColor: "#ddd",
        borderColor: "transparent",
        paddingVertical: RFPercentage(2),
    },
    item: {
        width: "50%",
    },
    button: {
        marginTop: RFPercentage(10),
    },
});
