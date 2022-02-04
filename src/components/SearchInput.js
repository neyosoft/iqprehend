import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AppText } from ".";
import theme from "../theme";

export const SearchInput = ({ style }) => {
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate("SearchArticle")}>
            <View style={[styles.container, style]}>
                <AppText style={styles.textInput}>Search for articles</AppText>
                <Icon name="magnify" size={RFPercentage(3)} />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        elevation: 3,
        borderColor: "red",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: RFPercentage(1),
        paddingLeft: RFPercentage(2.5),
        borderRadius: RFPercentage(1),
    },
    textInput: {
        flex: 1,
        color: theme.colors.diabledBtn,
    },
});
