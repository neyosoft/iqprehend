import React from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import theme from "../../theme";
import { AppMediumText, AppText } from "../../components";
import { PlagiarismIcon, GrammarIcon, ExpertIcon, VoteIcon } from "../../icons";

export const EvaluationResult = ({ navigation }) => {
    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>Evaluation</AppText>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                <AppMediumText style={styles.title}>
                    Perform Graphql Mutation And Query On The Same Screen/Page
                </AppMediumText>

                <AppText style={styles.body}>
                    GraqhQL has been an amazing technology provided by Facebook. It simplifies the client consumption of
                    information provided by the server in an incredible way. GraphQL gives clients the power to ask for
                    exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables
                    powerful developer tools.
                </AppText>

                <View>
                    <View style={styles.sectionHead}>
                        <AppText style={styles.sectionText}>Break Down</AppText>
                    </View>

                    <View style={styles.box}>
                        <View style={[styles.eachBox, { backgroundColor: "#FAEAEA" }]}>
                            <View style={styles.titleRow}>
                                <AppText style={[styles.sectionTitle, { color: "#CF2A2A" }]}>Plagiarism</AppText>
                                <PlagiarismIcon />
                            </View>
                            <AppMediumText style={[styles.sectionPercentage, { color: "#CF2A2A" }]}>25%</AppMediumText>
                        </View>
                        <View style={[styles.eachBox, { backgroundColor: "#E6F8E8" }]}>
                            <View style={styles.titleRow}>
                                <AppText style={[styles.sectionTitle, { color: "#07BA" }]}>Grammar</AppText>
                                <GrammarIcon />
                            </View>
                            <AppMediumText style={[styles.sectionPercentage, { color: "#07BA" }]}>25%</AppMediumText>
                        </View>
                    </View>

                    <View style={[styles.box, { marginTop: RFPercentage(2) }]}>
                        <View style={[styles.eachBox, { backgroundColor: "#EAEDF8" }]}>
                            <View style={styles.titleRow}>
                                <AppText style={[styles.sectionTitle, { color: "#3050B9" }]}>Expert</AppText>
                                <ExpertIcon />
                            </View>
                            <AppMediumText style={[styles.sectionPercentage, { color: "#3050B9" }]}>35%</AppMediumText>
                        </View>
                        <View style={[styles.eachBox, { backgroundColor: "#FFF7EA" }]}>
                            <View style={styles.titleRow}>
                                <AppText style={[styles.sectionTitle, { color: "#FFAC30" }]}>Votes</AppText>
                                <VoteIcon />
                            </View>
                            <AppMediumText style={[styles.sectionPercentage, { color: "#FFAC30" }]}>25%</AppMediumText>
                        </View>
                    </View>

                    <View style={styles.totalRow}>
                        <AppMediumText style={[styles.totalRowText]}>Total</AppMediumText>
                        <AppMediumText style={[styles.totalRowText]}>85%</AppMediumText>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    sectionHead: {
        borderWidth: 1,
        borderColor: "transparent",
        marginTop: RFPercentage(3),
        borderBottomColor: "#EAEAEA",
    },
    sectionText: {
        fontSize: RFPercentage(2.7),
    },
    box: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    eachBox: {
        width: "48%",
        padding: RFPercentage(2),
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontSize: RFPercentage(2.2),
    },
    sectionPercentage: {
        marginTop: RFPercentage(3),
        fontSize: RFPercentage(3),
    },
    totalRow: {
        flexDirection: "row",
        marginTop: RFPercentage(3),
        justifyContent: "space-between",
        paddingVertical: RFPercentage(1),
        backgroundColor: theme.colors.primary,
        paddingHorizontal: RFPercentage(2),
    },
    totalRowText: {
        color: "#fff",
        fontSize: RFPercentage(3),
    },
});
