import React from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from "react-native";

import theme from "../../theme";
import { AppMediumText, AppText } from "../../components";

export const SingleArticleView = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>Article</AppText>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                <AppMediumText style={styles.title}>
                    Perform Graphql Mutation And Query On The Same Screen/Page
                </AppMediumText>

                <View style={styles.dateBox}>
                    <View style={styles.postedBox}>
                        <Icon name="clock-outline" color="#608EC1" size={RFPercentage(3)} />
                        <AppText style={styles.postedText}>Posted on Feb 2, 2021</AppText>
                    </View>
                    <View style={[styles.deadlineBox, { marginLeft: RFPercentage(2) }]}>
                        <Icon name="clock-outline" color="#102F55" size={RFPercentage(3)} />
                        <AppText style={styles.deadlineText}>Deadline: Feb 7, 2021</AppText>
                    </View>
                </View>

                <AppText style={styles.body}>
                    GraqhQL has been an amazing technology provided by Facebook. It simplifies the client consumption of
                    information provided by the server in an incredible way. GraphQL gives clients the power to ask for
                    exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables
                    powerful developer tools. We at Herlabytes has adopted the cutting-edge technology and implementing
                    it into all of our mobile application, web application, personal website and also our server
                    deployment.
                </AppText>

                <View style={styles.summaryUserBox}>
                    <AppMediumText style={styles.summaryTitle}>Summaries</AppMediumText>
                    <FlatList
                        data={[1, 2, 3, 4, 5]}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => <SummaryCard item={item} navigation={navigation} />}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const SummaryCard = ({ item, navigation }) => (
    <TouchableOpacity style={styles.summaryUserCard} onPress={() => navigation.navigate("Summary")}>
        <View style={styles.summaryUserImageContainer}>
            <Image source={require("../../assets/images/avatar.jpg")} style={styles.summaryUserImage} />
        </View>
        <View style={styles.summaryUserCardRight}>
            <View style={styles.detailRow}>
                <AppMediumText style={styles.summaryUserCardLabel}>Name</AppMediumText>
                <AppText>Emmanuel Adeniyi</AppText>
            </View>
            <View style={styles.detailRow}>
                <AppMediumText style={styles.summaryUserCardLabel}>Email</AppMediumText>
                <AppText>access2emma@gmail.com</AppText>
            </View>
            <View style={styles.detailRow}>
                <AppMediumText style={styles.summaryUserCardLabel}>Status</AppMediumText>
                <AppText>Not yet reviewed</AppText>
            </View>
        </View>
    </TouchableOpacity>
);

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
    },
    dateBox: {
        alignItems: "center",
        flexDirection: "row",
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(3),
    },
    postedBox: {
        alignItems: "center",
        flexDirection: "row",
    },
    postedText: {
        color: "#608EC1",
        marginLeft: 4,
        fontSize: RFPercentage(1.8),
    },
    deadlineBox: {
        alignItems: "center",
        flexDirection: "row",
    },
    deadlineText: {
        color: "#102F55",
        marginLeft: 4,
        fontSize: RFPercentage(1.8),
    },
    summaryUserBox: {
        marginTop: RFPercentage(3),
    },
    summaryTitle: {
        fontSize: RFPercentage(2.3),
    },
    summaryUserCard: {
        elevation: 3,
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: RFPercentage(2),
        borderRadius: theme.radius.card,
        marginTop: RFPercentage(2),
    },
    summaryUserImageContainer: {
        overflow: "hidden",
        width: RFPercentage(10),
        height: RFPercentage(10),
        borderRadius: RFPercentage(6),
    },
    summaryUserImage: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    summaryUserCardRight: {
        flex: 1,
        marginLeft: RFPercentage(2),
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    summaryUserCardLabel: {
        width: RFPercentage(7),
    },
});
