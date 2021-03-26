import React from "react";
import Modal from "react-native-modal";
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import { InformationIcon } from "../icons";
import { AppMediumText, AppText, Button } from "../components";
import { moneyFormat } from "../utils/money.utils";

export const PaymentConfirmationModal = ({ show = false, onClose, onConfirm }) => {
    return (
        <Modal isVisible={show} onBackButtonPress={onClose} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.content}>
                        <InformationIcon />
                        <AppText style={styles.description}>Are are about to subscribe to the below plan</AppText>

                        <View style={styles.rowItem}>
                            <AppMediumText>Type</AppMediumText>
                            <AppText style={styles.rowItemValue}>One Month</AppText>
                        </View>

                        <View style={styles.rowItem}>
                            <AppMediumText>Amount</AppMediumText>
                            <AppText style={styles.rowItemValue}>{moneyFormat(1500)}</AppText>
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
