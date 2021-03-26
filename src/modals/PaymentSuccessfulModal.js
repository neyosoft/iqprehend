import React from "react";
import Modal from "react-native-modal";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import { CompletedCheckMark } from "../icons";
import { AppMediumText, AppText, Button } from "../components";

export const PaymentSuccessfulModal = ({ show = false, onClose }) => {
    return (
        <Modal isVisible={show} onBackButtonPress={onClose} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <CompletedCheckMark height={RFPercentage(9)} width={RFPercentage(9)} />
                    <AppMediumText style={styles.title}>Payment is successful</AppMediumText>
                    <AppText style={styles.description}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. At vel, ac natoque netus consectetur.
                    </AppText>

                    <TouchableWithoutFeedback onPress={onClose}>
                        <Button label="Continue" style={styles.button} />
                    </TouchableWithoutFeedback>
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
        width: "85%",
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#fff",
        padding: RFPercentage(2),
        paddingTop: RFPercentage(5),
        paddingBottom: RFPercentage(4),
    },
    title: {
        fontSize: RFPercentage(2.5),
        marginVertical: RFPercentage(3),
    },
    description: {
        textAlign: "center",
        fontSize: RFPercentage(1.8),
    },
    button: {
        marginTop: RFPercentage(3),
    },
});
