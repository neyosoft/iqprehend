import React from "react";
import { useQuery } from "react-query";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";

import { AppBoldText, AppText } from "../../../../components";

import theme from "../../../../theme";
import { useAuth } from "../../../../context";

export const Categories = () => {
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
            return <ActivityIndicator />;
        }

        return (
            <View style={styles.articleWrapper}>
                {sectorResponse.data.map((record) => (
                    <View style={styles.cellContainer} key={record._id}>
                        {switchIconToDisplay(record.name)}
                        <AppText style={styles.cellText}>{record.name}</AppText>
                    </View>
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
