import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider } from "react-native-fast-toast";

import AppNavigation from "./navigations";
import AppAuthProvider from "./context/auth.context";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

const App = () => {
    return (
        <SafeAreaProvider>
            <ToastProvider>
                <QueryClientProvider client={queryClient}>
                    <AppAuthProvider>
                        <AppNavigation />
                    </AppAuthProvider>
                </QueryClientProvider>
            </ToastProvider>
        </SafeAreaProvider>
    );
};

export default App;
