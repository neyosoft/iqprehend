import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigation from "./navigations";

const queryClient = new QueryClient();

const App = () => {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <AppNavigation />
            </QueryClientProvider>
        </SafeAreaProvider>
    );
};

export default App;
