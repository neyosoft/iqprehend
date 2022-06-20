import React from "react";
import Modal from "react-native-modal";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, TouchableWithoutFeedback, View, Image } from "react-native";

import { AppMediumText, AppText, Button } from "../components";
import theme from "../theme";

export const SummaryConfirmationModal = ({ show = false, onClose, onProceed }) => {
    return (
        <Modal isVisible={show} onBackButtonPress={onClose} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <Image source={require("../assets/images/summary_submission.png")} />
                    <AppText style={styles.description}>
                        <AppMediumText style={styles.boldDescription}>Deadline</AppMediumText> for submission of
                        summaries is <AppMediumText style={styles.boldDescription}>3:00 hours</AppMediumText>.
                    </AppText>

                    <AppText style={styles.description}>Would you like proceed?</AppText>

                    <TouchableWithoutFeedback onPress={onProceed}>
                        <Button label="Yes, Proceed" style={styles.button} />
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={onClose}>
                        <Button
                            label="Continue Reading"
                            style={styles.continueBtn}
                            labelStyle={styles.continueBtnLabel}
                        />
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
    description: {
        lineHeight: 22,
        textAlign: "center",
        fontSize: RFPercentage(1.9),
        paddingHorizontal: RFPercentage(1),
    },
    boldDescription: {
        color: theme.colors.primary,
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
