import React, { useState } from "react";
import { useQuery } from "react-query";
import { useToast } from "react-native-fast-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { Checkbox } from "../../components/Checkbox";
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
            return data.data.plans;
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

        const plans = planResponse.data.reduce((accum, plan) => {
            accum[plan.name] = plan;

            return accum;
        }, {});

        console.log("plans: ", plans)

        return (
            <ScrollView style={styles.scrollview} contentContainerStyle={styles.contentContainerStyle}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <AppText style={styles.cardHeaderText}>Standard</AppText>
                    </View>
                    <View style={styles.cardContent}>
                        <Checkbox
                            label="Monthly"
                            style={styles.checkbox}
                            checked={plan?.name === "STANDARD-MONTHLY"}
                            onPress={() =>
                                setPlan({
                                    type: "standard",
                                    duration: "One Month",
                                    name: "STANDARD-MONTHLY",
                                    id: plans["STANDARD-MONTHLY"]["_id"],
                                    price: plans["STANDARD-MONTHLY"]["price"],
                                })
                            }
                        />
                        <Checkbox
                            label="Quarterly"
                            style={styles.checkbox}
                            checked={plan?.name === "STANDARD-QUARTERLY"}
                            onPress={() =>
                                setPlan({
                                    type: "standard",
                                    duration: "One Quarter",
                                    name: "STANDARD-QUARTERLY",
                                    id: plans["STANDARD-QUARTERLY"]["_id"],
                                    price: plans["STANDARD-QUARTERLY"]["price"],
                                })
                            }
                        />
                        <Checkbox
                            label="Yearly"
                            style={styles.checkbox}
                            checked={plan?.name === "STANDARD-ANNUAL"}
                            onPress={() =>
                                setPlan({
                                    type: "standard",
                                    duration: "One Year",
                                    name: "STANDARD-ANNUAL",
                                    id: plans["STANDARD-ANNUAL"]["_id"],
                                    price: plans["STANDARD-ANNUAL"]["price"],
                                })
                            }
                        />

                        {plan?.type === "standard" ? (
                            <AppText style={styles.planPrice}>{moneyFormat(plans[plan.name]["price"])}</AppText>
                        ) : null}

                        <Button label="Proceed" style={styles.proceedBtn} onPress={handlePlanselection} />
                    </View>
                </View>
                <View style={[styles.card, { marginTop: RFPercentage(4) }]}>
                    <View style={styles.cardHeader}>
                        <AppText style={styles.cardHeaderText}>Expert</AppText>
                    </View>
                    <View style={styles.cardContent}>
                        <Checkbox
                            label="Monthly"
                            style={styles.checkbox}
                            checked={plan?.name === "EXPERT-MONTHLY"}
                            onPress={() =>
                                setPlan({
                                    type: "expert",
                                    duration: "One Month",
                                    name: "EXPERT-MONTHLY",
                                    id: plans["EXPERT-MONTHLY"]["_id"],
                                    price: plans["EXPERT-MONTHLY"]["price"],
                                })
                            }
                        />
                        <Checkbox
                            label="Quarterly"
                            style={styles.checkbox}
                            checked={plan?.name === "EXPERT-QUARTERLY"}
                            onPress={() =>
                                setPlan({
                                    type: "expert",
                                    name: "EXPERT-QUARTERLY",
                                    duration: "One Quarterly",
                                    id: plans["EXPERT-QUARTERLY"]["_id"],
                                    price: plans["EXPERT-QUARTERLY"]["price"],
                                })
                            }
                        />
                        <Checkbox
                            label="Yearly"
                            style={styles.checkbox}
                            checked={plan?.name === "EXPERT-ANNUAL"}
                            onPress={() =>
                                setPlan({
                                    type: "expert",
                                    name: "EXPERT-ANNUAL",
                                    duration: "One Year",
                                    id: plans["EXPERT-ANNUAL"]["_id"],
                                    price: plans["EXPERT-ANNUAL"]["price"],
                                })
                            }
                        />
                        {plan?.type === "expert" ? (
                            <AppText style={styles.planPrice}>{moneyFormat(plans[plan.name]["price"])}</AppText>
                        ) : null}

                        <Button label="Proceed" style={styles.proceedBtn} onPress={handlePlanselection} />
                    </View>
                </View>
                <View style={[styles.card, { marginTop: RFPercentage(4) }]}>
                    <View style={styles.cardHeader}>
                        <AppText style={styles.cardHeaderText}>Premium</AppText>
                    </View>
                    <View style={styles.cardContent}>
                        <Checkbox
                            label="Monthly"
                            style={styles.checkbox}
                            checked={plan?.name === "PREMIUM-MONTHLY"}
                            onPress={() =>
                                setPlan({
                                    type: "premium",
                                    duration: "One Month",
                                    name: "PREMIUM-MONTHLY",
                                    id: plans["PREMIUM-MONTHLY"]["_id"],
                                    price: plans["PREMIUM-MONTHLY"]["price"],
                                })
                            }
                        />
                        <Checkbox
                            label="Quarterly"
                            style={styles.checkbox}
                            checked={plan?.name === "PREMIUM-QUARTERLY"}
                            onPress={() =>
                                setPlan({
                                    type: "premium",
                                    duration: "One Quarter",
                                    name: "PREMIUM-QUARTERLY",
                                    id: plans["PREMIUM-QUARTERLY"]["_id"],
                                    price: plans["PREMIUM-QUARTERLY"]["price"],
                                })
                            }
                        />
                        <Checkbox
                            label="Yearly"
                            style={styles.checkbox}
                            checked={plan?.name === "PREMIUM-ANNUAL"}
                            onPress={() =>
                                setPlan({
                                    type: "premium",
                                    duration: "One Year",
                                    name: "PREMIUM-ANNUAL",
                                    id: plans["PREMIUM-ANNUAL"]["_id"],
                                    price: plans["PREMIUM-ANNUAL"]["price"],
                                })
                            }
                        />
                        {plan?.type === "premium" ? (
                            <AppText style={styles.planPrice}>{moneyFormat(plans[plan.name]["price"])}</AppText>
                        ) : null}

                        <Button label="Proceed" style={styles.proceedBtn} onPress={handlePlanselection} />
                    </View>
                </View>
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

                    <AppText style={styles.headerTitle}>Payment Plans</AppText>
                </View>

                {renderContent()}
            </View>

            <PaymentConfirmationModal
                plan={plan}
                show={showConfirmModal}
                plans={planResponse.data}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => {
                    setShowConfirmModal(false);

                    navigation.navigate("MakePayment", { plan });
                }}
            />
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
