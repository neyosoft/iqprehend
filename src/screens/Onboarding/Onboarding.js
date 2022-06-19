import React, { useRef, useEffect } from "react";
import RNBootSplash from "react-native-bootsplash";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { AppMediumText, AppText, Button } from "../../components";

const { width, height } = Dimensions.get("window");

export const Onboarding = () => {
    const scrollviewRef = useRef();

    const { completeOnboarding } = useAuth();

    useEffect(() => {
        RNBootSplash.hide();
    }, []);

    return (
        <SafeAreaView>
            <ScrollView
                horizontal={true}
                ref={scrollviewRef}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}>
                <View style={styles.page}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.imageContent} source={require("../../assets/images/slider1.png")} />
                    </View>
                    <View style={styles.titleContainer}>
                        <AppMediumText style={styles.title}>High Quality Articles</AppMediumText>
                        <AppMediumText style={styles.subtitle}>
                            We create and enhance the information available at our disposal and within our spheres of
                            influence to provide our subscribers with dependable, informative and reliable articles and
                            videos
                        </AppMediumText>
                    </View>
                    <View style={styles.barContainer}>
                        <View style={[styles.emptyBar, styles.activeBar]} />
                        <View style={styles.emptyBar} />
                        <View style={styles.emptyBar} />
                    </View>

                    <Button
                        label="Next"
                        style={styles.button}
                        onPress={() => scrollviewRef?.current?.scrollTo({ x: width, y: 0, animated: true })}
                    />
                    <TouchableOpacity onPress={completeOnboarding}>
                        <AppText style={styles.skipText}>Skip</AppText>
                    </TouchableOpacity>
                </View>
                <View style={styles.page}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.imageContent} source={require("../../assets/images/slider2.png")} />
                    </View>
                    <View style={styles.titleContainer}>
                        <AppMediumText style={styles.title}>Robust Evaluation Systems</AppMediumText>
                        <AppMediumText style={styles.subtitle}>
                            We employ metrics that enable fair play and transparent processes to independently determine
                            the most ratable summaries submitted by our subscribers.
                        </AppMediumText>
                    </View>
                    <View style={styles.barContainer}>
                        <View style={styles.emptyBar} />
                        <View style={[styles.emptyBar, styles.activeBar]} />
                        <View style={styles.emptyBar} />
                    </View>

                    <Button
                        label="Next"
                        style={styles.button}
                        onPress={() => scrollviewRef?.current?.scrollTo({ x: width * 2, y: 0, animated: true })}
                    />
                    <TouchableOpacity onPress={completeOnboarding}>
                        <AppText style={styles.skipText}>Skip</AppText>
                    </TouchableOpacity>
                </View>
                <View style={styles.page}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.imageContent} source={require("../../assets/images/slider3.png")} />
                    </View>
                    <View style={styles.titleContainer}>
                        <AppMediumText style={styles.title}>Competitive Reward for Summaries</AppMediumText>
                        <AppMediumText style={styles.subtitle}>
                            Our reward system is targeted at the very best, with the least grammatical errors, high
                            level of cohesion and no plagiarism.
                        </AppMediumText>
                    </View>
                    <View style={styles.barContainer}>
                        <View style={styles.emptyBar} />
                        <View style={styles.emptyBar} />
                        <View style={[styles.emptyBar, styles.activeBar]} />
                    </View>
                    <Button label="Get Started" style={styles.button} onPress={completeOnboarding} />
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
    page: {
        width,
        height,
        alignItems: "center",
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    imageContainer: {
        width: width * 0.6,
        height: width * 0.6,
    },
    imageContent: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    titleContainer: {
        width: "80%",
        justifyContent: "center",
        height: RFPercentage(30),
        marginTop: RFPercentage(5),
    },
    title: {
        textAlign: "center",
        color: theme.colors.primary,
        fontSize: RFPercentage(3),
        lineHeight: RFPercentage(4),
    },
    subtitle: {
        color: "#686868",
        textAlign: "center",
        fontSize: RFPercentage(2),
        marginTop: RFPercentage(1),
        lineHeight: RFPercentage(3),
    },
    skipText: {
        marginTop: 13,
        color: "#6A6A6A",
    },
    barContainer: {
        flexDirection: "row",
    },
    emptyBar: {
        height: 5,
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 2,
        width: RFPercentage(1.5),
        borderColor: theme.colors.primary,
    },
    activeBar: {
        width: RFPercentage(3),
        backgroundColor: theme.colors.primary,
    },

    button: {
        width: "80%",
        marginTop: RFPercentage(3),
    },
});
