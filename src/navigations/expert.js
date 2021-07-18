import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { RFPercentage } from "react-native-responsive-fontsize";
import TouchableItem from "@react-navigation/drawer/src/views/TouchableItem";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";

import {
    Summary,
    Articles,
    Settings,
    SearchArticle,
    ChangePassword,
    EvaluationResult,
    PersonalSettings,
    SingleArticleView,
} from "../screens/Experts";
import { ArticleIcon, LogoutIcon, SettingsIcon } from "../icons";
import { AppMediumText, AppText, ExistingRouteList } from "../components";
import { useAuth } from "../context";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigation = () => {
    return (
        <Drawer.Navigator
            initialRouteName="Articles"
            drawerStyle={{ backgroundColor: "#F6F6F6" }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            drawerContentOptions={{ activeTintColor: "#121212", inactiveTintColor: "#174542" }}>
            <Drawer.Screen
                name="Articles"
                component={Articles}
                options={{
                    title: "All Articles",
                    drawerIcon: ({ color }) => <ArticleIcon color={color} />,
                }}
            />

            <Drawer.Screen
                name="Settings"
                component={Settings}
                options={{ title: "Settings", drawerIcon: ({ color }) => <SettingsIcon color={color} /> }}
            />
        </Drawer.Navigator>
    );
};

export default function UserNavigation() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="DrawerNavigation">
            <Stack.Screen name="Summary" component={Summary} />
            <Stack.Screen name="SearchArticle" component={SearchArticle} />
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="PersonalSettings" component={PersonalSettings} />
            <Stack.Screen name="EvaluationResult" component={EvaluationResult} />
            <Stack.Screen name="SingleArticleView" component={SingleArticleView} />
        </Stack.Navigator>
    );
}

function CustomDrawerContent(props) {
    const { logout, user } = useAuth();

    return (
        <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.imageBox}>
                    <Image
                        style={styles.profileImage}
                        source={
                            user?.profilePicture ? { uri: user.profilePicture } : require("../assets/images/avatar.jpg")
                        }
                    />
                </View>
                <View style={styles.nameBox}>
                    <AppMediumText style={styles.nameText}>
                        {user?.firstName} {user?.lastName}
                    </AppMediumText>
                    <AppText style={styles.emailText}>{user?.email}</AppText>
                </View>
            </View>

            <View style={styles.navContent}>
                <ExistingRouteList {...props} />
                <TouchableItem
                    delayPressIn={0}
                    onPress={logout}
                    style={[styles.button]}
                    accessibilityRole="button"
                    accessibilityComponentType="button"
                    accessibilityState={{ selected: false }}
                    accessibilityTraits="button">
                    <>
                        <LogoutIcon />
                        <AppText style={styles.label}>Logout</AppText>
                    </>
                </TouchableItem>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        paddingTop: RFPercentage(5),
        paddingBottom: RFPercentage(2),
        paddingHorizontal: RFPercentage(2),
    },
    imageBox: {
        overflow: "hidden",
        width: RFPercentage(10),
        height: RFPercentage(10),
        borderRadius: RFPercentage(5),
    },
    profileImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    nameBox: {
        marginTop: RFPercentage(1),
    },
    nameText: {
        fontSize: RFPercentage(2.2),
    },
    emailText: {
        color: "#121212",
        fontSize: RFPercentage(1.8),
    },
    navContent: {
        padding: RFPercentage(2),
    },
    button: {
        padding: 8,
        borderRadius: 6,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        color: "#174542",
        marginLeft: RFPercentage(2),
    },
});
