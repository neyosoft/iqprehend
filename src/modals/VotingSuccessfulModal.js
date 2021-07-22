import React from "react";
import Modal from "react-native-modal";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import { CompletedCheckMark } from "../icons";
import { AppMediumText, AppText, Button } from "../components";

export const VotingSuccessfulModal = ({ show = false, onClose }) => {
    return (
        <Modal isVisible={show} onBackButtonPress={onClose} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <CompletedCheckMark height={RFPercentage(9)} width={RFPercentage(9)} />
                    <AppMediumText style={styles.title}>Voting Completed!</AppMediumText>
                    <AppText style={styles.description}>
                        Thank you for voting for this summary. Your request has been submitted and will be processed
                        accordingly.
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
        fontSize: RFPercentage(2.7),
        marginVertical: RFPercentage(3),
    },
    description: {
        lineHeight: 22,
        textAlign: "center",
        paddingHorizontal: RFPercentage(1),
        fontSize: RFPercentage(1.9),
    },
    button: {
        marginTop: RFPercentage(3),
    },
});
