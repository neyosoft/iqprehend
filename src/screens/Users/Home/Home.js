import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";

import { Categories, Header, SearchInput, Summaries, TopArticles, WelcomeHeader } from "./components";

export const Home = () => {
    const [search, setSearch] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                <WelcomeHeader />
                <SearchInput search={search} setSearch={setSearch} />
                <View style={styles.spacing}>
                    <Categories />
                    <TopArticles search={search} />
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
    contentContainerStyle: {
        // padding: RFPercentage(2),
    },
    spacing: {
        paddingHorizontal: RFPercentage(2),
    },
});
