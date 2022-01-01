import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";

import { Categories, Header, WelcomeHeader } from "./components";

export const Home = () => {
    const [search, setSearch] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                <WelcomeHeader />
                <Categories />
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
        padding: RFPercentage(2),
    },
});
