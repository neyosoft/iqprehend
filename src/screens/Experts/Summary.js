import React from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import theme from "../../theme";
import { AppMediumText, AppText, AppTextField, Button } from "../../components";

export const Summary = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>Summary</AppText>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                <AppMediumText style={styles.title}>Summary details</AppMediumText>

                <AppText>
                    GraqhQL has been an amazing technology provided by Facebook. It simplifies the client consumption of
                    information provided by the server in an incredible way. GraphQL gives clients the power to ask for
                    exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables
                    powerful developer tools. We at Herlabytes has adopted the cutting-edge technology and implementing
                    it into all of our mobile application, web application, personal website and also our server
                    deployment.
                </AppText>

                <AppTextField label="Score" keyboardType="number-pad" style={styles.scoreInput} />
                <AppText style={styles.note}>
                    <AppMediumText>Note:</AppMediumText> Maximum summary score is 35
                </AppText>

                <Button label="Submit" style={styles.button} />
            </ScrollView>
        </View>
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
        padding: RFPercentage(3),
    },
    contentContainerStyle: {
        padding: RFPercentage(3),
    },
    title: {
        fontSize: RFPercentage(2.5),
        marginBottom: RFPercentage(1),
    },
    scoreInput: {
        marginTop: RFPercentage(3),
    },
    note: {
        fontSize: RFPercentage(1.8),
        marginTop: RFPercentage(1),
    },
    button: {
        marginTop: RFPercentage(5),
    },
});
