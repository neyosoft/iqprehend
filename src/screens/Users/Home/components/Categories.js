import React from "react";
import { useQuery } from "react-query";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";

import { AppBoldText, AppText } from "../../../../components";

import theme from "../../../../theme";
import { useAuth } from "../../../../context";

export const Categories = () => {
    const navigation = useNavigation();
    const { authenticatedRequest } = useAuth();

    const sectorResponse = useQuery("sectors", async () => {
        try {
            const { data } = await authenticatedRequest().get("/sector");

            if (data && data.data) {
                return data.data.sectors;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const renderOutput = () => {
        if (sectorResponse.isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            );
        }

        return (
            <View style={styles.articleWrapper}>
                {sectorResponse.data.map((record) => (
                    <TouchableOpacity
                        key={record._id}
                        style={styles.cellContainer}
                        onPress={() => navigation.navigate("Category", { sector: record })}>
                        {switchIconToDisplay(record.name)}
                        <AppText style={styles.cellText}>{record.name}</AppText>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const switchIconToDisplay = (name) => {
        switch (name?.toLowerCase()) {
            case "academics":
                return <Image source={require("../../../../assets/images/Academics.png")} />;
            case "entertainment":
                return <Image source={require("../../../../assets/images/Entertainment.png")} />;
            case "sports":
                return <Image source={require("../../../../assets/images/Sports.png")} />;
            case "business":
                return <Image source={require("../../../../assets/images/Business.png")} />;
            case "technology":
                return <Image source={require("../../../../assets/images/Technology.png")} />;
            case "politics":
                return <Image source={require("../../../../assets/images/Politics.png")} />;
            case "entrepreneurship":
                return <Image source={require("../../../../assets/images/Entrepreneurship.png")} />;
            case "economics":
                return <Image source={require("../../../../assets/images/Economics.png")} />;

            default:
                return <Image source={require("../../../../assets/images/Politics.png")} />;
        }
    };

    return (
        <View style={styles.container}>
            <AppBoldText style={styles.title}>Categories</AppBoldText>

            {renderOutput()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    loadingContainer: {
        alignSelf: "center",
        margin: RFPercentage(4),
        justifyContent: "center",
    },
    title: {
        fontSize: RFPercentage(3.5),
        color: theme.colors.primary,
    },
    articleWrapper: {
        marginTop: 10,
        flexWrap: "wrap",
        flexDirection: "row",
    },
    flatlist: {
        marginTop: 5,
    },
    cellContainer: {
        width: "25%",
        alignItems: "center",
        marginBottom: RFPercentage(2),
    },
    cellText: {
        fontSize: RFPercentage(1.5),
        lineHeight: RFPercentage(2),
    },
});
