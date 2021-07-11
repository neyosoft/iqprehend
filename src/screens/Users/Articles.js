import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Platform } from "react-native";
import { useQuery } from "react-query";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import theme from "../../theme";
import { SearchIcon } from "../../icons";
import { AppText, Button } from "../../components";
import { ArticleCard } from "../../cards/ArticleCard";
import { useAuth } from "../../context";

const data = [
    { title: "Rhoncus arcu massa Rhoncus arcu massa 1." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 2." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 3." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 4." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 5." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 6." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 7." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 8." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 9." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 10." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 11." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 12." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 13." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 14." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 15." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 16." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 17." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 18." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 19." },
    { title: "Rhoncus arcu massa Rhoncus arcu massa 20." },
];

export const Articles = ({ navigation }) => {
    const { authenticatedRequest } = useAuth();

    const articlesResponse = useQuery(["articles"], async () => {
        try {
            const { data } = await authenticatedRequest().get(`/articles`);

            if (data && data.data) {
                return data.data;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const renderArticleItem = ({ item }) => (
        <ArticleCard
            title={item.title}
            imageSource={require("../../assets/images/image1.png")}
            onPress={() => navigation.navigate("SingleArticleView")}
        />
    );

    const ItemSeparatorComponent = () => <View style={styles.separator} />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.openDrawer}>
                    <Icon name="menu" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>

                <AppText style={styles.headerTitle}>All Articles</AppText>

                <TouchableOpacity>
                    <SearchIcon />
                </TouchableOpacity>
            </View>

            <View style={styles.filterArea}>
                <View style={styles.filterBox} />
                <View style={styles.filterBox} />
                <Button label="FILTER" style={styles.filterBtn} />
            </View>

            <View style={styles.content}>
                <FlatList
                    renderItem={renderArticleItem}
                    keyExtractor={(item) => item._id}
                    data={articlesResponse.data.articles}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                    removeClippedSubviews={Platform.OS === "android"}
                />
            </View>
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
    filterArea: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingVertical: RFPercentage(2),
        paddingHorizontal: RFPercentage(3),
    },
    filterBox: {
        borderWidth: 1,
        marginRight: 8,
        width: RFPercentage(14),
        height: RFPercentage(5),
        borderRadius: theme.radius.label,
    },
    filterBtn: {
        paddingHorizontal: RFPercentage(3),
        paddingVertical: RFPercentage(1),
    },
    content: {
        flex: 1,
        marginTop: RFPercentage(1),
        paddingHorizontal: RFPercentage(3),
    },
    separator: {
        height: RFPercentage(3),
    },
});
