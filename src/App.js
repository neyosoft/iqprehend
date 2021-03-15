import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Login, Register } from "./screens/Auth/Login";

import { Colors } from "react-native/Libraries/NewAppScreen";

const queryClient = new QueryClient();

const App = () => {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <Login />
            </QueryClientProvider>
        </SafeAreaProvider>
    );
};

export default App;
