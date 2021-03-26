import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import UserNavigation from "./user";
import AuthNavigation from "./auth";
import ExpertNavigation from "./expert";

export default function AppNavigation() {
    // const user = null;
    // const user = { role: "USER" };
    const user = { role: "EXPERT" };

    return <NavigationContainer>{switchNavigator(user)}</NavigationContainer>;
}

const switchNavigator = (user) => {
    if (!user) {
        return <AuthNavigation />;
    }

    if (user.role === "USER") {
        return <UserNavigation />;
    } else if (user.role === "EXPERT") {
        return <ExpertNavigation />;
    } else {
        return <AuthNavigation />;
    }
};
