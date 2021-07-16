import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider } from "react-native-fast-toast";
import RNPaystack from "react-native-paystack";

import AppNavigation from "./navigations";
import AppAuthProvider from "./context/auth.context";

import Config from "../config";

RNPaystack.init({
    publicKey: Config.environment === "development" ? Config.DEV_PAYSTACK_KEY : Config.PROD_PAYSTACK_KEY,
});

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
