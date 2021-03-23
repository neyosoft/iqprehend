import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { RFPercentage } from "react-native-responsive-fontsize";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";

import {
    Articles,
    Settings,
    MyArticles,
    BankSettings,
    ChangePassword,
    PersonalSettings,
    SingleArticleView,
} from "../screens/Users";
import { ArticleIcon, MyArticleIcon, SettingsIcon } from "../icons";
import { AppMediumText, AppText, ExistingRouteList } from "../components";

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
                name="MyArticles"
                component={MyArticles}
                options={{ title: "My Articles", drawerIcon: ({ color }) => <MyArticleIcon color={color} /> }}
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
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
            <Stack.Screen name="BankSettings" component={BankSettings} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="PersonalSettings" component={PersonalSettings} />
            <Stack.Screen name="SingleArticleView" component={SingleArticleView} />
        </Stack.Navigator>
    );
}

function CustomDrawerContent(props) {
    const user = { firstName: "Emmanuel", lastName: "Samson" };

    return (
        <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.imageBox}>
                    <Image source={require("../assets/images/avatar.jpg")} style={styles.profileImage} />
                </View>
                <View style={styles.nameBox}>
                    <AppMediumText style={styles.nameText}>Obagunwa Emmanuel</AppMediumText>
                    <AppText style={styles.emailText}>access2emma@gmail.com</AppText>
                </View>
            </View>

            <View style={styles.navContent}>
                <ExistingRouteList {...props} />
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
});
