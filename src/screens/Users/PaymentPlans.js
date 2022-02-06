import React, { useState } from "react";
import { useQuery } from "react-query";
import Carousel from "react-native-snap-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { PaymentConfirmationModal } from "../../modals/PaymentConfirmationModal";
import { AppBoldText, AppMediumText, AppText, Button, PageLoading } from "../../components";

const { width } = Dimensions.get("window");

export const PaymentPlans = ({ navigation }) => {
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

    const _renderItem = ({ item, index }) => {
        const isCenterView = index === 1;
        return (
            <View style={[styles.slide, isCenterView ? styles.evenSlide : undefined]}>
                <AppBoldText style={[styles.slideTitle, isCenterView ? styles.evenSlideTitle : undefined]}>
                    {item.name}
                </AppBoldText>
                <View style={styles.slideItemContainer}>
                    <View style={[styles.slideItemBox, isCenterView ? styles.evenSlideItemBox : undefined]} />
                    <AppText style={[styles.slideItemLabel, isCenterView ? styles.evenSlideItemLabel : undefined]}>
                        1 Article and video per month
                    </AppText>
                </View>
                <View style={styles.slideItemContainer}>
                    <View style={[styles.slideItemBox, isCenterView ? styles.evenSlideItemBox : undefined]} />
                    <AppText style={[styles.slideItemLabel, isCenterView ? styles.evenSlideItemLabel : undefined]}>
                        1 Summary per month
                    </AppText>
                </View>
                <View style={styles.slideItemContainer}>
                    <View style={[styles.slideItemBox, isCenterView ? styles.evenSlideItemBox : undefined]} />
                    <AppText style={[styles.slideItemLabel, isCenterView ? styles.evenSlideItemLabel : undefined]}>
                        Win up to {item.reward} month
                    </AppText>
                </View>

                <AppMediumText
                    style={[styles.slideItemPriceLabel, isCenterView ? styles.evenSlideItemPriceLabel : undefined]}>
                    NGN{item.price}
                </AppMediumText>

                <Button
                    label="Subscribe Now"
                    onPress={() => {
                        setPlan(item.name.toUpperCase());
                        setShowConfirmModal(true);
                    }}
                    labelStyle={isCenterView ? styles.centerBtnLabel : undefined}
                    style={[styles.button, isCenterView ? styles.centerBtn : undefined]}
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
                reward: "N10,000",
                price: `${plans.STANDARD.price}/Year`,
            },
            {
                name: "Expert",
                reward: "N25,000",
                price: `${plans.EXPERT.price}/Month`,
            },
            {
                name: "Premium",
                reward: "N50,000",
                price: `${plans.PREMIUM.price}/Year`,
            },
        ];

        return (
            <View>
                <AppText style={styles.introText}>
                    Thank you for reading. Subcribe to any of our product catergories to submit a summary
                </AppText>

                <View style={styles.sliderWrapper}>
                    <Carousel
                        firstItem={1}
                        data={ENTRIES}
                        enableSnap={false}
                        sliderWidth={width}
                        inactiveSlideOpacity={1}
                        renderItem={_renderItem}
                        itemWidth={RFPercentage(32)}
                    />
                </View>

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
        margin: RFPercentage(3),
        color: theme.colors.primary,
    },
    sliderWrapper: {
        marginTop: RFPercentage(3),
    },
    slide: {
        elevation: 3,
        borderRadius: 6,
        borderWidth: 0.3,
        backgroundColor: "#fff",
        padding: RFPercentage(4),
        borderColor: theme.colors.primary,
    },
    evenSlide: {
        backgroundColor: theme.colors.primary,
    },
    slideTitle: {
        textAlign: "center",
        fontSize: RFPercentage(2.7),
        color: theme.colors.primary,
        marginBottom: RFPercentage(1),
    },
    evenSlideTitle: {
        color: "#fff",
    },
    slideItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFPercentage(2.5),
    },
    slideItemBox: {
        width: 2,
        height: 2,
        borderColor: 2,
        marginRight: 5,
        backgroundColor: theme.colors.primary,
    },
    evenSlideItemBox: {
        backgroundColor: "#fff",
    },
    slideItemLabel: {
        color: theme.colors.primary,
        fontSize: RFPercentage(1.6),
    },
    evenSlideItemLabel: {
        color: "#fff",
    },
    slideItemPriceLabel: {
        textAlign: "center",
        fontSize: RFPercentage(2.5),
        color: theme.colors.primary,
        marginTop: RFPercentage(4),
    },
    evenSlideItemPriceLabel: {
        color: "#fff",
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
    button: {
        borderRadius: 6,
        paddingHorizontal: 0,
        marginTop: RFPercentage(4),
    },
    centerBtn: {
        backgroundColor: "#fff",
    },
    centerBtnLabel: {
        color: theme.colors.primary,
    },
});
