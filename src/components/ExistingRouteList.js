import React from "react";
import { View, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import TouchableItem from "@react-navigation/drawer/src/views/TouchableItem";

import { AppText } from "./AppText";
import { AppMediumText } from "./AppMediumText";

export const ExistingRouteList = ({
    state,
    itemStyle,
    labelStyle,
    navigation,
    descriptors,
    activeTintColor,
    inactiveTintColor,
    activeBackgroundColor,
    inactiveBackgroundColor,
}) => {
    return state.routes.map((route, i) => {
        const focused = i === state.index;
        const { title, drawerLabel, drawerIcon } = descriptors[route.key].options;

        return (
            <DrawerItem
                key={route.key}
                icon={drawerIcon}
                focused={focused}
                style={itemStyle}
                labelStyle={labelStyle}
                activeTintColor={activeTintColor}
                inactiveTintColor={inactiveTintColor}
                label={drawerLabel || title || route.name}
                activeBackgroundColor={activeBackgroundColor}
                inactiveBackgroundColor={inactiveBackgroundColor}
                onPress={() =>
                    navigation.dispatch({
                        ...(focused ? DrawerActions.closeDrawer() : CommonActions.navigate(route.name)),
                        target: state.key,
                    })
                }
            />
        );
    });
};

const DrawerItem = ({
    icon,
    label,
    style,
    onPress,
    labelStyle,
    focused = false,
    activeTintColor,
    inactiveTintColor,
}) => {
    const color = focused ? activeTintColor : inactiveTintColor;

    const ActiveText = focused ? AppMediumText : AppText;

    return (
        <View style={[styles.container, style]}>
            <TouchableItem
                delayPressIn={0}
                onPress={onPress}
                style={[styles.button]}
                accessibilityRole="button"
                accessibilityComponentType="button"
                accessibilityState={{ selected: focused }}
                accessibilityStates={focused ? ["selected"] : []}
                accessibilityTraits={focused ? ["button", "selected"] : "button"}>
                <>
                    {icon({ focused, color })}
                    <ActiveText style={[styles.label, labelStyle, { color }]}>{label}</ActiveText>
                </>
            </TouchableItem>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
    },
    button: {
        padding: 8,
        borderRadius: 6,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        marginLeft: RFPercentage(2),
    },
});
