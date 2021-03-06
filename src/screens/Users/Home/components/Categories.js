import React from "react";
import { useQuery } from "react-query";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";

import { AppBoldText, AppText } from "../../../../components";

import theme from "../../../../theme";
import { useAuth } from "../../../../context";

const listedCategories = ["academics", "entertainment", "business", "technology", "politics", "entrepreneurship"];

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

        if (sectorResponse.data?.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <AppText>No category found.</AppText>
                </View>
            );
        }

        const categories = sectorResponse.data.filter((record) =>
            listedCategories.includes(record.name?.toLowerCase()),
        );

        return (
            <View style={styles.articleWrapper}>
                {categories.map((record) => (
                    <TouchableOpacity
                        key={record._id}
                        style={styles.cellContainer}
                        onPress={() => navigation.navigate("Category", { sector: record })}>
                        <View style={styles.itemImageContainer}>{switchIconToDisplay(record.name)}</View>
                        <AppText style={styles.cellText}>{record.name}</AppText>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const switchIconToDisplay = (name) => {
        switch (name?.toLowerCase()) {
            case "academics":
                return <Image style={styles.itemImage} source={require("../../../../assets/images/Academics.png")} />;
            case "entertainment":
                return (
                    <Image style={styles.itemImage} source={require("../../../../assets/images/Entertainment.png")} />
                );
            case "business":
                return <Image style={styles.itemImage} source={require("../../../../assets/images/Business.png")} />;
            case "technology":
                return <Image style={styles.itemImage} source={require("../../../../assets/images/Technology.png")} />;
            case "politics":
                return <Image style={styles.itemImage} source={require("../../../../assets/images/Politics.png")} />;
            case "entrepreneurship":
                return (
                    <Image
                        style={styles.itemImage}
                        source={require("../../../../assets/images/Entrepreneurship.png")}
                    />
                );
            default:
                return (
                    <Image style={styles.itemImage} source={require("../../../../assets/images/Entertainment.png")} />
                );
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
    emptyContainer: {
        alignSelf: "center",
        marginTop: RFPercentage(2),
        marginBottom: RFPercentage(4),
        justifyContent: "center",
    },
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
        width: `${100 / 3}%`,
        alignItems: "center",
        marginBottom: RFPercentage(2),
    },
    itemImageContainer: {
        width: RFPercentage(15),
        height: RFPercentage(15),
    },
    itemImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    cellText: {
        color: "#060169",
        textAlign: "center",
        fontSize: RFPercentage(1.6),
        lineHeight: RFPercentage(2),
    },
});
