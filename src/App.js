import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SingleArticleView } from "./screens/Users";
import { Login, Register, ForgetPassword, PasswordReset, PasswordResetSuccessful } from "./screens/Auth";

const queryClient = new QueryClient();

const App = () => {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <SingleArticleView />
            </QueryClientProvider>
        </SafeAreaProvider>
    );
};

export default App;
