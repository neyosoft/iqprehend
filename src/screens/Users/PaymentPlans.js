import React, { useState } from "react";
import { useQuery } from "react-query";
import Carousel from "react-native-snap-carousel";
import { useToast } from "react-native-fast-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, TouchableOpacity, StatusBar, TouchableWithoutFeedback, Dimensions } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { PaymentConfirmationModal } from "../../modals/PaymentConfirmationModal";
import { AppBoldText, AppMediumText, AppText, Button, PageLoading } from "../../components";

const { width } = Dimensions.get("window");

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

    const _renderItem = ({ item }) => {
        return (
            <View style={styles.slide}>
                <AppBoldText style={styles.slideTitle}>{item.name}</AppBoldText>
                <AppText style={styles.slideItemLabel}>1 Article and video per month</AppText>
                <AppText style={styles.slideItemLabel}>1 Summary per month</AppText>
                <AppText style={styles.slideItemLabel}>Win up to N10,000 month</AppText>

                <AppMediumText style={styles.slideItemPriceLabel}>NGN{item.price}</AppMediumText>

                <Button
                    style={{ paddingHorizontal: 0, marginTop: RFPercentage(4), borderRadius: 6 }}
                    label="Subscribe Now"
                />
            </View>
        );
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

        const ENTRIES = [
            {
                name: "Standard",
                price: `${plans.STANDARD.price}/Year`,
            },
            {
                name: "Expert",
                price: `${plans.EXPERT.price}/Month`,
            },
            {
                name: "Premium",
                price: `${plans.PREMIUM.price}/Year`,
            },
        ];

        return (
            <View style={styles.contentContainer}>
                <AppText style={styles.introText}>
                    Thank you for reading. Subcribe to any of our product catergories to submit a summary
                </AppText>

                <View style={styles.sliderWrapper}>
                    <Carousel data={ENTRIES} renderItem={_renderItem} sliderWidth={width} itemWidth={250} />
                </View>

                {/* <Button label="Proceed" style={styles.proceedBtn} onPress={handlePlanselection} /> */}

                <PaymentConfirmationModal
                    show={showConfirmModal}
                    plan={planResponse?.data[plan]}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={() => {
                        setShowConfirmModal(false);

                        navigation.navigate("MakePayment", { plan: planResponse.data[plan] });
                    }}
                />
            </View>
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
        backgroundColor: "#fff",
    },
    contentContainer: {
        padding: RFPercentage(3),
    },
    introText: {
        textAlign: "center",
        color: theme.colors.primary,
    },
    sliderWrapper: {
        marginTop: RFPercentage(3),
    },
    slide: {
        elevation: 3,
        borderRadius: 6,
        backgroundColor: "#fff",
        padding: RFPercentage(4),
    },
    slideTitle: {
        color: theme.colors.primary,
        fontSize: RFPercentage(3),
    },
    slideItemLabel: {
        color: theme.colors.primary,
        marginTop: RFPercentage(2),
        fontSize: RFPercentage(1.8),
    },
    slideItemPriceLabel: {
        textAlign: "center",
        fontSize: RFPercentage(2.5),
        color: theme.colors.primary,
        marginTop: RFPercentage(3),
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
    proceedBtn: {
        marginTop: RFPercentage(5),
    },
});
