import React from "react";
import Modal from "react-native-modal";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import { InformationIcon } from "../icons";
import { moneyFormat } from "../utils/money.utils";
import { AppMediumText, AppText, Button } from "../components";

export const PaymentConfirmationModal = ({ show = false, plan, onClose, onConfirm }) => {
    return (
        <Modal isVisible={show} onBackButtonPress={onClose} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.content}>
                        <InformationIcon width={RFPercentage(6)} height={RFPercentage(6)} />
                        <AppText style={styles.description}>You are about to subscribe to the below plan</AppText>

                        <View style={styles.rowItem}>
                            <AppMediumText>Type</AppMediumText>
                            <AppText style={styles.rowItemValue}>{plan?.duration}</AppText>
                        </View>

                        <View style={styles.rowItem}>
                            <AppMediumText>Amount</AppMediumText>
                            <AppText style={styles.rowItemValue}>{moneyFormat(plan?.price || 0)}</AppText>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <AppMediumText>Cancel</AppMediumText>
                        </TouchableOpacity>

                        <TouchableWithoutFeedback onPress={onConfirm}>
                            <Button label="Proceed" style={styles.proceedBtn} />
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
    card: {
        width: "85%",
        borderRadius: 5,
        overflow: "hidden",
        backgroundColor: "#fff",
    },
    content: {
        alignItems: "center",
        padding: RFPercentage(2),
        paddingTop: RFPercentage(5),
    },
    description: {
        textAlign: "center",
        marginTop: RFPercentage(3),
        fontSize: RFPercentage(1.8),
        marginVertical: RFPercentage(1),
    },
    rowItem: {
        flexDirection: "row",
    },
    rowItemValue: {
        marginLeft: RFPercentage(2),
        color: "#787878",
    },
    footer: {
        borderTopWidth: 1,
        flexDirection: "row",
        borderTopColor: "#ddd",
        padding: RFPercentage(2),
        backgroundColor: "#F9F9F9",
        marginTop: RFPercentage(2),
        paddingTop: RFPercentage(2),
        justifyContent: "space-between",
    },
    cancelBtn: {
        borderColor: "#E5E5E5",
        backgroundColor: "#fff",
        paddingVertical: RFPercentage(1),
        paddingHorizontal: RFPercentage(4),
    },
    proceedBtn: {
        paddingHorizontal: RFPercentage(4),
        paddingVertical: RFPercentage(1),
    },
});
