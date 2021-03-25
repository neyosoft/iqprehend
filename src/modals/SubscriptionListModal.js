import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { RFPercentage } from "react-native-responsive-fontsize";

import { moneyFormatWS } from "../utils/money.utils";
import { AppMediumText, AppText, Button } from "../components";
import { NairaIcon } from "../icons";

export const SubscriptionListModal = ({ show = false, onClose }) => {
    return (
        <Modal isVisible={show} onBackButtonPress={onClose} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.header}>
                        <AppMediumText>Monthly</AppMediumText>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.amountRow}>
                            <NairaIcon />
                            <AppMediumText style={styles.valueText}>{moneyFormatWS(1500)}</AppMediumText>
                        </View>
                        <TouchableOpacity style={styles.button}>
                            <AppText>Subscribe</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.box, { marginTop: RFPercentage(3) }]}>
                    <View style={styles.header}>
                        <AppMediumText>3 Months</AppMediumText>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.amountRow}>
                            <NairaIcon />
                            <AppMediumText style={styles.valueText}>{moneyFormatWS(4000)}</AppMediumText>
                        </View>
                        <TouchableOpacity style={styles.button}>
                            <AppText>Subscribe</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.box, { marginTop: RFPercentage(3) }]}>
                    <View style={styles.header}>
                        <AppMediumText>Yearly</AppMediumText>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.amountRow}>
                            <NairaIcon />
                            <AppMediumText style={styles.valueText}>{moneyFormatWS(20000)}</AppMediumText>
                        </View>
                        <TouchableOpacity style={styles.button}>
                            <AppText>Subscribe</AppText>
                        </TouchableOpacity>
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
        width: "80%",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    header: {
        borderBottomWidth: 1,
        padding: RFPercentage(2),
        borderBottomColor: "#D9D9D9",
        paddingVertical: RFPercentage(1),
    },
    content: {
        alignItems: "center",
    },
    amountRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFPercentage(3),
        marginBottom: RFPercentage(1),
    },
    valueText: {
        marginLeft: RFPercentage(1),
        fontSize: RFPercentage(3),
    },
    button: {
        width: "70%",
        borderWidth: 1,
        alignItems: "center",
        borderColor: "#E5E5E5",
        padding: RFPercentage(1),
        backgroundColor: "transparent",
        marginBottom: RFPercentage(2),
    },
});
