import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const SearchInput = ({ search, setSearch }) => {
    return (
        <View style={styles.container}>
            <TextInput
                value={search}
                onChangeText={setSearch}
                style={styles.textInput}
                placeholder="Search for articles"
            />
            <Icon name="magnify" size={RFPercentage(3)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        elevation: 3,
        borderColor: "red",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        margin: RFPercentage(2),
        borderRadius: RFPercentage(1),
        marginTop: -RFPercentage(4),
        paddingHorizontal: RFPercentage(1),
    },
    textInput: {
        flex: 1,
        height: 41,
    },
});
