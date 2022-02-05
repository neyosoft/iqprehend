import React, { useState } from "react";
import { useQuery } from "react-query";
import { useToast } from "react-native-fast-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, TouchableWithoutFeedback } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { moneyFormat } from "../../utils/money.utils";
import { AppText, Button, PageLoading } from "../../components";
import { PaymentConfirmationModal } from "../../modals/PaymentConfirmationModal";

export const PaymentPlans = ({ navigation }) => {
    const toast = useToast();
    const { authenticatedRequest } = useAuth();

    const [plan, setPlan] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const planResponse = useQuery("plans", async () => {
        const { data } = await authenticatedRequest().get("/plan");

        if (data && data.data) {
            return data.data;
        } else {
            throw new Error("Unable to retrieve payment plans");
        }
    });

    const handlePlanselection = () => {
        if (!plan) {
            return toast.show("Please select a plan");
        }

        setShowConfirmModal(true);
    };

    const renderContent = () => {
        if (planResponse.isLoading) {
            return <PageLoading />;
        }

        if (planResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText style={{ width: "70%", alignSelf: "center", textAlign: "center", marginTop: 20 }}>
                        Unable to retrieve payment plans
                    </AppText>

                    <Button label="Retry" style={{ marginTop: RFPercentage(5) }} onPress={planResponse.refetch} />
                </View>
            );
        }

        const plans = planResponse.data;

        return (
            <>
                <ScrollView style={styles.scrollview} contentContainerStyle={styles.contentContainerStyle}>
                    <TouchableWithoutFeedback onPress={() => setPlan("STANDARD")}>
                        <View style={[styles.card, plan === "STANDARD" ? styles.activeCardContent : undefined]}>
                            <View style={styles.cardHeader}>
                                <AppText style={styles.cardHeaderText}>Standard</AppText>
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.planPrice}>{moneyFormat(plans.STANDARD.price)}/year</AppText>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => setPlan("EXPERT")}>
                        <View
                            style={[
                                styles.card,
                                { marginTop: RFPercentage(4) },
                                plan === "EXPERT" ? styles.activeCardContent : undefined,
                            ]}>
                            <View style={styles.cardHeader}>
                                <AppText style={styles.cardHeaderText}>Expert</AppText>
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.planPrice}>{moneyFormat(plans.EXPERT.price)}/month</AppText>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => setPlan("PREMIUM")}>
                        <View
                            style={[
                                styles.card,
                                { marginTop: RFPercentage(4) },
                                plan === "PREMIUM" ? styles.activeCardContent : undefined,
                            ]}>
                            <View style={styles.cardHeader}>
                                <AppText style={styles.cardHeaderText}>Premium</AppText>
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.planPrice}>{moneyFormat(plans.PREMIUM.price)}/year</AppText>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <Button label="Proceed" style={styles.proceedBtn} onPress={handlePlanselection} />
                </ScrollView>

                <PaymentConfirmationModal
                    show={showConfirmModal}
                    plan={planResponse?.data[plan]}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={() => {
                        setShowConfirmModal(false);

                        navigation.navigate("MakePayment", { plan: planResponse.data[plan] });
                    }}
                />
            </>
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

                    <AppText style={styles.headerTitle}>Payment Plans</AppText>
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
    scrollview: {
        marginTop: RFPercentage(2),
    },
    contentContainerStyle: {
        padding: RFPercentage(3),
    },
    card: {
        borderRadius: 5,
        overflow: "hidden",
        backgroundColor: "#fff",
        paddingBottom: RFPercentage(3),
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
        width: "70%",
        marginTop: 10,
        alignSelf: "center",
    },
    activeCardContent: {
        backgroundColor: "#999",
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
        marginTop: RFPercentage(5),
    },
});
