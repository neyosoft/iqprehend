import React, { useState } from "react";
import { useQuery } from "react-query";
import format from "date-fns/format";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../../theme";
import { useAuth } from "../../context";
import { Header } from "./Home/components";
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
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    );

    const renderContent = () => {
        if (paymentResponse.isLoading || paymentResponse.isFetching) {
            return <PageLoading />;
        }

        if (paymentResponse.isError) {
            return (
                <View style={styles.centeredView}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText style={styles.errorLabel}>
                        There is a problem retrieving your subscription at the moment. Kindly try again.
                    </AppText>

                    <Button label="Retry" style={{ marginTop: RFPercentage(5) }} onPress={paymentResponse.refetch} />
                </View>
            );
        }

        if (!paymentResponse.data?.planDetails) {
            return (
                <View style={styles.centeredView}>
                    <Image source={require("../../assets/images/information.png")} />
                    <AppBoldText style={styles.title}>No active subscription</AppBoldText>
                    <AppText style={styles.description}>You do not have an active subscription.</AppText>

                    <Button
                        label="Try again."
                        onPress={paymentResponse.refetch}
                        style={[styles.button, styles.retryButton]}
                        labelStyle={{ color: theme.colors.primary }}
                    />
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
                        <AppText style={styles.item}>{format(new Date(plan.startDate), "MMMM dd, yyyy")}</AppText>
                    </View>
                    <View style={styles.itemRow}>
                        <AppMediumText style={[styles.item, { color: theme.colors.primary }]}>End Date</AppMediumText>
                        <AppText style={styles.item}>{format(new Date(plan.endDate), "MMMM dd, yyyy")}</AppText>
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
        <SafeAreaView edges={["top"]} style={styles.root}>
            <View style={styles.container}>
                <Header />

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
    root: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    errorLabel: {
        width: "70%",
        marginTop: 20,
        alignSelf: "center",
        textAlign: "center",
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
        marginTop: RFPercentage(2),
    },
    retryButton: {
        borderWidth: 1,
        backgroundColor: "#fff",
        marginTop: RFPercentage(5),
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.small,
    },
});
