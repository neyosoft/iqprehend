import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Login, Register } from "./screens/Auth";

const queryClient = new QueryClient();

const App = () => {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <Register />
            </QueryClientProvider>
        </SafeAreaProvider>
    );
};

export default App;
