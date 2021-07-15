import React from "react";
import { useQuery } from "react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { ArticleCard } from "../../cards/ArticleCard";
import { AppText, Button, PageLoading } from "../../components";

export const Evaluation = ({ navigation }) => {
    const { authenticatedRequest } = useAuth();

    const articlesResponse = useQuery(["all-summaries"], async () => {
        try {
            const { data } = await authenticatedRequest().get("/summary", {
                params: { isEvaluated: true },
            });

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
            article={item.article}
            onPress={() => navigation.navigate("SingleArticleView", { articleID: item.article._id })}
        />
    );

    const renderEmptyArticle = () => (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: RFPercentage(50) }}>
            <AppText>No record found.</AppText>
        </View>
    );

    const ItemSeparatorComponent = () => <View style={styles.separator} />;

    const renderArticles = () => {
        if (articlesResponse.isLoading) {
            return <PageLoading />;
        }

        if (articlesResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText>There is a problem fetching articles.</AppText>

                    <Button label="Retry" style={{ marginTop: RFPercentage(5) }} onPress={articlesResponse.refetch} />
                </View>
            );
        }

        return (
            <>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigation.openDrawer}>
                        <Icon name="menu" color="#fff" size={RFPercentage(3.5)} />
                    </TouchableOpacity>

                    <AppText style={styles.headerTitle}>Evaluation</AppText>
                </View>

                <FlatList
                    style={styles.flatlist}
                    renderItem={renderArticleItem}
                    keyExtractor={(item) => item._id}
                    onRefresh={articlesResponse.refetch}
                    data={articlesResponse.data.summaries}
                    ListEmptyComponent={renderEmptyArticle}
                    refreshing={articlesResponse.isFetching}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                    removeClippedSubviews={Platform.OS === "android"}
                    contentContainerStyle={styles.contentContainerStyle}
                />
            </>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            <View style={styles.container}>{renderArticles()}</View>
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
    filterArea: {
        flexDirection: "row",
        alignItems: "center",
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
        height: RFPercentage(5),
        paddingVertical: RFPercentage(1),
        paddingHorizontal: RFPercentage(3),
    },
    dropdownInput: {
        fontSize: 15,
        color: "gray",
        borderWidth: 1,
        marginRight: 8,
        borderRadius: 8,
        paddingRight: 30,
        paddingLeft: 10,
        width: RFPercentage(14),
        height: RFPercentage(5),
    },
    flatlist: {
        marginTop: RFPercentage(1),
    },
    contentContainerStyle: {
        paddingHorizontal: RFPercentage(2),
    },
    separator: {
        height: RFPercentage(3),
    },
});
