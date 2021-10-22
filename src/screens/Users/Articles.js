import React, { useState } from "react";
import { useQuery } from "react-query";
import RNPickerSelect from "react-native-picker-select";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { SearchIcon } from "../../icons";
import { ArticleCard } from "../../cards/ArticleCard";
import { AppText, Button, PageLoading } from "../../components";

export const Articles = ({ navigation }) => {
    const { authenticatedRequest } = useAuth();

    const [sector, setSector] = useState("");
    const [articleType, setArticleType] = useState("");

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

    const articlesResponse = useQuery(["articles", { sector, articleType }], async () => {
        try {
            const { data } = await authenticatedRequest().get("/articles/published", {
                params: { sector, articleType },
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

    useFocusEffect(
        React.useCallback(() => {
            articlesResponse.refetch();
        }, []),
    );

    const renderArticleItem = ({ item }) => (
        <ArticleCard article={item} onPress={() => navigation.navigate("SingleArticleView", { articleID: item._id })} />
    );

    const renderEmptyArticle = () => (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: RFPercentage(50) }}>
            <AppText>No article found.</AppText>
        </View>
    );

    const ItemSeparatorComponent = () => <View style={styles.separator} />;

    const renderArticles = () => {
        if (articlesResponse.isLoading || sectorResponse.isLoading) {
            return <PageLoading />;
        }

        if (articlesResponse.isError || sectorResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText>There is a problem fetching articles.</AppText>

                    <Button
                        label="Retry"
                        style={{ marginTop: RFPercentage(5) }}
                        onPress={() => {
                            sectorResponse.refetch();
                            articlesResponse.refetch();
                        }}
                    />
                </View>
            );
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigation.openDrawer}>
                        <Icon name="menu" color="#fff" size={RFPercentage(3.5)} />
                    </TouchableOpacity>

                    <AppText style={styles.headerTitle}>All Articles</AppText>

                    <TouchableOpacity onPress={() => navigation.navigate("SearchArticle")}>
                        <SearchIcon />
                    </TouchableOpacity>
                </View>

                <View style={styles.filterArea}>
                    <RNPickerSelect
                        value={sector}
                        onValueChange={setSector}
                        useNativeAndroidPickerStyle={false}
                        placeholder={{ label: "All", value: null }}
                        Icon={() => <Icon name="chevron-down" size={24} color="#000" />}
                        items={sectorResponse.data.map((record) => ({ label: record.name, value: record._id }))}
                        style={{
                            inputIOS: styles.dropdownInput,
                            inputAndroid: styles.dropdownInput,
                            iconContainer: { top: 7, right: 15 },
                        }}
                    />
                    <RNPickerSelect
                        value={articleType}
                        onValueChange={setArticleType}
                        useNativeAndroidPickerStyle={false}
                        placeholder={{ label: "All", value: null }}
                        Icon={() => <Icon name="chevron-down" size={24} color="#000" />}
                        items={[
                            { label: "Video", value: "VIDEO" },
                            { label: "Textual", value: "TEXT" },
                        ]}
                        style={{
                            inputIOS: styles.dropdownInput,
                            inputAndroid: styles.dropdownInput,
                            iconContainer: { top: 7, right: 15 },
                        }}
                    />
                </View>

                <FlatList
                    style={styles.flatlist}
                    renderItem={renderArticleItem}
                    keyExtractor={(item) => item._id}
                    onRefresh={articlesResponse.refetch}
                    data={articlesResponse.data.articles}
                    refreshing={articlesResponse.isFetching}
                    ListEmptyComponent={renderEmptyArticle}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                    removeClippedSubviews={Platform.OS === "android"}
                    contentContainerStyle={styles.contentContainerStyle}
                />
            </View>
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
        marginRight: 8,
        borderRadius: 8,
        paddingRight: 30,
        paddingLeft: 10,
        width: RFPercentage(14),
        height: RFPercentage(5),
        borderWidth: StyleSheet.hairlineWidth,
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
