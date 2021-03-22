import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import UserNavigation from "./user";
import AuthNavigation from "./auth";

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <UserNavigation />
        </NavigationContainer>
    );
}
