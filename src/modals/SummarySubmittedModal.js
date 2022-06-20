import React from "react";
import Modal from "react-native-modal";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, TouchableWithoutFeedback, View, Image } from "react-native";

import theme from "../theme";
import { AppText, Button } from "../components";

export const SummarySubmittedModal = ({ show = false, onClose }) => {
    return (
        <Modal isVisible={show} onBackButtonPress={onClose} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <AppText style={styles.title}>Article submitted!</AppText>
                    <AppText style={styles.description}>Your submission will be reviewed and evaluated,</AppText>

                    <Image style={styles.finishImage} source={require("../assets/images/finish_line.png")} />

                    <TouchableWithoutFeedback onPress={onClose}>
                        <Button label="Back to Home" style={styles.button} />
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
        color: theme.colors.primary,
    },
    description: {
        marginTop: 10,
        lineHeight: 22,
        color: "#636363",
        textAlign: "center",
        fontSize: RFPercentage(1.9),
        paddingHorizontal: RFPercentage(3),
    },
    finishImage: {
        marginTop: RFPercentage(3),
    },
    button: {
        marginTop: RFPercentage(3),
    },
    continueBtn: {
        marginTop: 10,
        paddingHorizontal: 0,
        backgroundColor: "#F5F5F5",
    },
    continueBtnLabel: {
        color: theme.colors.primary,
    },
});
