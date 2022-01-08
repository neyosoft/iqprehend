import React from "react";
import { useQuery } from "react-query";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, FlatList, Platform, StatusBar, Image, TouchableWithoutFeedback } from "react-native";

import theme from "../../../theme";
import { Header } from "./components";
import { useAuth } from "../../../context";
import { VideoArticleIcon } from "../../../icons";
import { AppMediumText, AppText, Button, PageLoading, SearchInput } from "../../../components";

export const Category = ({ navigation, route }) => {
    const { sector } = route.params;

    const { user, authenticatedRequest } = useAuth();

    const sectorId = sector._id;

    const articlesResponse = useQuery(["articles", sectorId], async () => {
        try {
            const { data } = await authenticatedRequest().get("/articles/published", {
                params: { sector: sectorId },
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
        <TouchableWithoutFeedback onPress={() => navigation.navigate("SingleArticleView", { articleID: item._id })}>
            <View style={styles.cellContainer} key={item._id}>
                {item.articleType === "TEXT" ? (
                    <View style={styles.imagebox}>
                        <Image
                            resizeMode="cover"
                            style={styles.articleFeatureImage}
                            source={{ uri: item.featuredImage }}
                        />
                    </View>
                ) : (
                    <View style={styles.videoImageWrapper}>
                        <VideoArticleIcon />
                    </View>
                )}
                <AppText style={styles.cellText}>{item.title}</AppText>
            </View>
        </TouchableWithoutFeedback>
    );

    const renderEmptyArticle = () => (
        <View style={styles.emptyContainer}>
            <AppText>No article found.</AppText>
        </View>
    );

    const renderArticles = () => {
        if (articlesResponse.isLoading) {
            return <PageLoading />;
        }

        if (articlesResponse.isError) {
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
                <View style={styles.topHeader}>
                    <SearchInput style={styles.searchbox} />
                    <Image
                        style={styles.photo}
                        source={
                            user?.profilePicture
                                ? { uri: user.profilePicture }
                                : require("../../../assets/images/avatar.jpg")
                        }
                    />
                </View>

                <AppMediumText style={styles.headerTitle}>{sector.name}</AppMediumText>

                <FlatList
                    numColumns={3}
                    style={styles.flatlist}
                    renderItem={renderArticleItem}
                    keyExtractor={(item) => item._id}
                    onRefresh={articlesResponse.refetch}
                    data={articlesResponse.data.articles}
                    ListEmptyComponent={renderEmptyArticle}
                    refreshing={articlesResponse.isFetching}
                    columnWrapperStyle={styles.columnWrapperStyle}
                    removeClippedSubviews={Platform.OS === "android"}
                    contentContainerStyle={styles.contentContainerStyle}
                />
            </View>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            <Header navigation={navigation} />
            <View style={styles.container}>{renderArticles()}</View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
        padding: RFPercentage(2),
    },
    photo: {
        width: RFPercentage(6),
        height: RFPercentage(6),
        borderRadius: RFPercentage(6),
    },
    searchbox: {
        flex: 1,
        marginRight: RFPercentage(5),
    },
    headerTitle: {
        margin: RFPercentage(2),
        color: theme.colors.primary,
        fontSize: RFPercentage(4),
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: RFPercentage(50),
    },
    flatlist: {
        marginTop: RFPercentage(1),
    },
    columnWrapperStyle: {
        marginBottom: 10,
    },
    contentContainerStyle: {
        paddingHorizontal: RFPercentage(2),
    },
    separator: {
        height: RFPercentage(3),
    },
    articleWrapper: {
        marginTop: 10,
        flexWrap: "wrap",
        flexDirection: "row",
    },
    cellContainer: {
        width: `${100 / 3.1}%`,
        marginRight: RFPercentage(1),
    },
    cellText: {
        marginTop: 5,
        fontSize: RFPercentage(1.7),
        lineHeight: RFPercentage(2.3),
    },
    videoImageWrapper: {
        alignItems: "center",
        backgroundColor: "#C4C4C4",
        height: RFPercentage(8),
        justifyContent: "center",
        borderRadius: RFPercentage(1),
    },
    imagebox: {
        overflow: "hidden",
        height: RFPercentage(8),
        backgroundColor: "#C4C4C4",
        borderRadius: RFPercentage(1),
    },
    articleFeatureImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
});
