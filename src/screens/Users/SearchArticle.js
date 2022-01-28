import { useQuery } from "react-query";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    View,
    Image,
    FlatList,
    Platform,
    StatusBar,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { VideoArticleIcon } from "../../icons";
import { AppText, Button, PageLoading } from "../../components";

export const SearchArticle = ({ navigation }) => {
    const timer = useRef();
    const searchInput = useRef();

    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState("");

    const { authenticatedRequest } = useAuth();

    const articlesResponse = useQuery(["articles", search], async () => {
        try {
            const { data } = await authenticatedRequest().get("/articles/published", { params: { search } });

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

    useEffect(() => {
        if (timer?.current) {
            clearTimeout(timer?.current);
        }

        timer.current = setTimeout(() => {
            setSearch(searchText);

            return () => clearTimeout(timer?.current);
        }, 500);
    }, [searchText]);

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
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: RFPercentage(50) }}>
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
                            articlesResponse.refetch();
                        }}
                    />
                </View>
            );
        }

        return (
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
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>

                <TextInput
                    ref={searchInput}
                    value={searchText}
                    style={styles.searchInput}
                    onChangeText={setSearchText}
                    placeholder="Seach articles"
                    placeholderTextColor="#7189A8"
                    onLayout={() => searchInput?.current?.focus()}
                />
            </View>
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
    searchInput: {
        flex: 1,
        height: 40,
        color: "#fff",
        borderBottomWidth: 1,
        marginHorizontal: 10,
        borderBottomColor: "#7189A8",
        fontFamily: "Rubik-Regular",
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
