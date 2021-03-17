import React from "react";
import { \StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

export const ArticleCard = ({ style, title, body, imageSource }) => (
    <View style={[styles.card, style]}>
        <View style={styles.leftSide}>
            <AppMediumText style={styles.title}>{title}</AppMediumText>
            <AppText style={styles.articleBody}>{body}</AppText>
            <View>
                <AppMediumText>Read Article</AppMediumText>
            </View>
        </View>
        <Image source={imageSource} />
    </View>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFPercentage(2),
    },
    leftSide: {
        flex: 1,
        marginRight: RFPercentage(2),
    },
    articleBody: {
        marginVertical: 5,
    },
});
