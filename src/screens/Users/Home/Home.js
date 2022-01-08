import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";

import { SearchInput } from "../../../components";
import { Categories, Header, Summaries, TopArticles, WelcomeHeader } from "./components";

export const Home = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView>
                <WelcomeHeader />
                <SearchInput style={styles.searchbox} />
                <View style={styles.spacing}>
                    <Categories />
                    <TopArticles />
                    <Summaries />
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
    spacing: {
        paddingHorizontal: RFPercentage(2),
    },
    searchbox: {
        margin: RFPercentage(2),
        marginTop: -RFPercentage(4),
    },
});
