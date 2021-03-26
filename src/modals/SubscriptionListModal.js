import React, { useState } from "react";
import Modal from "react-native-modal";
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../theme";
import { moneyFormat } from "../utils/money.utils";
import { AppMediumText, AppText, Button } from "../components";

export const SubscriptionListModal = ({ show = false, onClose, onChange }) => {
    const [option, setOption] = useState(null);

    return (
        <Modal isVisible={show} onBackButtonPress={onClose} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.header}>
                        <AppMediumText>Subscriptions</AppMediumText>
                    </View>

                    <View style={styles.cardContainer}>
                        <TouchableOpacity style={styles.card} onPress={() => setOption("ONE-MONTH")}>
                            <Icon
                                size={RFPercentage(4)}
                                color={theme.colors.primary}
                                name={option === "ONE-MONTH" ? "circle-slice-8" : "checkbox-blank-circle-outline"}
                            />
                            <View style={styles.cardRight}>
                                <AppText>1 Month</AppText>
                                <AppMediumText style={styles.valueText}>{moneyFormat(1500)}</AppMediumText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card} onPress={() => setOption("THREE-MONTH")}>
                            <Icon
                                size={RFPercentage(4)}
                                color={theme.colors.primary}
                                name={option === "THREE-MONTH" ? "circle-slice-8" : "checkbox-blank-circle-outline"}
                            />
                            <View style={styles.cardRight}>
                                <AppText>3 Months</AppText>
                                <AppMediumText style={styles.valueText}>{moneyFormat(4000)}</AppMediumText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card} onPress={() => setOption("ONE-YEAR")}>
                            <Icon
                                size={RFPercentage(4)}
                                color={theme.colors.primary}
                                name={option === "ONE-YEAR" ? "circle-slice-8" : "checkbox-blank-circle-outline"}
                            />
                            <View style={styles.cardRight}>
                                <AppText>1 Year</AppText>
                                <AppMediumText style={styles.valueText}>{moneyFormat(15000)}</AppMediumText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card} onPress={() => setOption("LIFE-TIME")}>
                            <Icon
                                size={RFPercentage(4)}
                                color={theme.colors.primary}
                                name={option === "LIFE-TIME" ? "circle-slice-8" : "checkbox-blank-circle-outline"}
                            />
                            <View style={styles.cardRight}>
                                <AppText>Life Time</AppText>
                                <AppMediumText style={styles.valueText}>{moneyFormat(60000)}</AppMediumText>
                            </View>
                        </TouchableOpacity>

                        <TouchableWithoutFeedback onPress={() => onChange(option)}>
                            <Button label="Subscribe" style={styles.button} />
                        </TouchableWithoutFeedback>
                    </View>
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
        width: "90%",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    header: {
        borderBottomWidth: 1,
        padding: RFPercentage(2),
        borderBottomColor: "#D9D9D9",
        paddingVertical: RFPercentage(1),
    },
    cardContainer: {
        marginHorizontal: RFPercentage(3),
    },
    card: {
        elevation: 3,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        padding: RFPercentage(2),
        marginTop: RFPercentage(2),
        shadowColor: "#000",
        shadowRadius: 3,
        shadowOpacity: 0.6,
        shadowOffset: {
            x: 3,
            y: 3,
        },
    },
    cardRight: {
        marginLeft: RFPercentage(2),
    },
    valueText: {
        fontSize: RFPercentage(3),
    },
    button: {
        marginVertical: RFPercentage(3),
    },
});
