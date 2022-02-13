import React from "react";
import Modal from "react-native-modal";
import { useQuery } from "react-query";
import Carousel from "react-native-snap-carousel";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StyleSheet, TouchableWithoutFeedback, View, Dimensions } from "react-native";

import theme from "../theme";
import { authenticatedRequest } from "../utils/request.utils";
import { AppBoldText, AppText, Button, PageLoading } from "../components";

const { width } = Dimensions.get("window");

export const PaymentPlanModal = ({ show = false, onClose, onChange }) => {
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

                <AppBoldText
                    style={[styles.slideItemPriceLabel, isCenterView ? styles.evenSlideItemPriceLabel : undefined]}>
                    NGN{item.price}
                </AppBoldText>

                <TouchableWithoutFeedback
                    onPress={() => {
                        onChange(planResponse.data[item.name.toUpperCase()]);
                    }}>
                    <Button
                        label="Subscribe Now"
                        labelStyle={isCenterView ? styles.centerBtnLabel : undefined}
                        style={[styles.button, isCenterView ? styles.centerBtn : undefined]}
                    />
                </TouchableWithoutFeedback>
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
            </View>
        );
    };

    return (
        <Modal isVisible={show} onBackButtonPress={onClose} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <AppText style={styles.description}>
                        Thank you for reading. Subcribe to any of our product catergories to submit a summary.
                    </AppText>

                    <View style={styles.planContainer}>{renderContent()}</View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    box: {
        width: "105%",
        height: "70%",
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#fff",
        padding: RFPercentage(2),
        paddingTop: RFPercentage(5),
        paddingBottom: RFPercentage(5),
    },
    description: {
        lineHeight: 22,
        textAlign: "center",
        fontSize: RFPercentage(1.9),
        color: theme.colors.primary,
        paddingHorizontal: RFPercentage(1),
    },
    planContainer: {
        marginTop: RFPercentage(2),
    },
    sliderWrapper: {
        marginTop: RFPercentage(3),
    },
    slide: {
        elevation: 4,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "red",
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
