import React, { useState } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../../theme";
import { AppMediumText, AppText, Button } from "../../components";
import { SubscriptionListModal } from "../../modals/SubscriptionListModal";
import { PaymentSuccessfulModal } from "../../modals/PaymentSuccessfulModal";
import { PaymentConfirmationModal } from "../../modals/PaymentConfirmationModal";

export const Payment = ({ navigation }) => {
    const [modal, setModal] = useState(null);
    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigation.openDrawer}>
                        <Icon name="menu" color="#fff" size={RFPercentage(3.5)} />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>Payment</AppText>
                </View>
                <View style={styles.content}>
                    <AppMediumText style={styles.title}>Active Subscription</AppMediumText>

                    <View style={styles.boxContainer}>
                        <View style={styles.itemRow}>
                            <AppMediumText style={[styles.item, { color: theme.colors.primary }]}>Type</AppMediumText>
                            <AppText style={styles.item}>Yearly</AppText>
                        </View>
                        <View style={styles.itemRow}>
                            <AppMediumText style={[styles.item, { color: theme.colors.primary }]}>
                                Duration
                            </AppMediumText>
                            <AppText style={styles.item}>1 Year</AppText>
                        </View>
                        <View style={styles.itemRow}>
                            <AppMediumText style={[styles.item, { color: theme.colors.primary }]}>
                                Start Date
                            </AppMediumText>
                            <AppText style={styles.item}>June 27, 2020</AppText>
                        </View>
                        <View style={styles.itemRow}>
                            <AppMediumText style={[styles.item, { color: theme.colors.primary }]}>
                                End Date
                            </AppMediumText>
                            <AppText style={styles.item}>June 27, 2021</AppText>
                        </View>
                    </View>

                    <Button style={styles.button} onPress={() => setModal("list")} label="Subscribe" />
                </View>
            </View>

            <SubscriptionListModal
                show={modal === "list"}
                onClose={() => setModal(null)}
                onChange={(option) => {
                    setModal("confirm");
                    console.log("Selected option: ", option);
                }}
            />
            <PaymentConfirmationModal
                show={modal === "confirm"}
                onClose={() => setModal(null)}
                onConfirm={() => setModal("success")}
            />
            <PaymentSuccessfulModal show={modal === "success"} onClose={() => setModal(null)} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    content: {
        padding: RFPercentage(4),
    },
    title: {
        fontSize: RFPercentage(2.5),
    },
    boxContainer: {
        marginTop: RFPercentage(2),
    },
    itemRow: {
        borderWidth: 1,
        flexDirection: "row",
        borderBottomColor: "#ddd",
        borderColor: "transparent",
        paddingVertical: RFPercentage(2),
    },
    item: {
        width: "50%",
    },
    button: {
        marginTop: RFPercentage(10),
    },
});
