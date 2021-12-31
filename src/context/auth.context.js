import axios from "axios";
import React, { Component, useContext } from "react";

import {
    getUserToken,
    saveUserToken,
    getRefreshToken,
    removeUserToken,
    saveRefreshToken,
    removeRefreshToken,
    getOnboardingStatus,
    onboardingCompleted,
} from "../utils/storage.utils";
import Config from "../../config";
import { baseRequest } from "../utils/request.utils";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export default class AuthProvider extends Component {
    state = {
        user: null,
        isLoading: true,
        accessToken: null,
        refreshToken: null,
        isOnboardingCompleted: false,

        authenticate: async ({ accessToken, refreshToken, user }) => {
            await Promise.all([saveUserToken(accessToken), saveRefreshToken(refreshToken)]);

            this.setState({
                user,
                accessToken,
                refreshToken,
                isLoading: false,
            });
        },
        updateUser: async (user) => {
            this.setState({ user });
        },
        logout: async () => {
            try {
                await axios.post("/auth/logout", params, {
                    baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
                    headers: {
                        Authorization: `Bearer ${this.state.accessToken}`,
                        "X-Refresh-Token": `Bearer ${this.state.refreshToken}`,
                    },
                });
            } catch (error) {}

            await Promise.all([removeUserToken(), removeRefreshToken()]);

            this.setState({
                user: null,
                getUserToken: null,
                refreshToken: null,
            });
        },
        refreshUser: async () => {
            try {
                const { data } = await baseRequest.get("/user/profile", {
                    baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
                    headers: {
                        Authorization: `Bearer ${this.state.accessToken}`,
                    },
                });

                if (data && data.status) {
                    this.setState({ user: data.data });
                }
            } catch (e) {}
        },
        completeOnboarding: async () => {
            await onboardingCompleted();
            this.setState({ isOnboardingCompleted: true });
        },
        authenticatedRequest: () => {
            const { accessToken, refreshToken } = this.state;

            const instance = axios.create({
                baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            instance.interceptors.response.use(
                async (response) => {
                    return response;
                },
                async (error) => {
                    const originalRequest = error.config;
                    if (error.response && error.response.status === 401 && !originalRequest._retry) {
                        originalRequest._retry = true;

                        const { data } = await axios.post(
                            "/auth/refresh-token",
                            {},
                            {
                                baseURL:
                                    Config.environment === "production"
                                        ? Config.PROD_SERVER_URL
                                        : Config.DEV_SERVER_URL,
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                    "X-Refresh-Token": `Bearer ${refreshToken}`,
                                },
                            },
                        );

                        if (data && data.data && data.data.status) {
                            try {
                                const { token, refreshToken } = data.data;

                                await Promise.all([saveUserToken(token), saveRefreshToken(refreshToken)]);

                                this.setState({ accessToken: token, refreshToken });

                                originalRequest.headers["Authorization"] = "Bearer " + token;

                                return axios(originalRequest);
                            } catch (tryError) {
                                return Promise.reject(error);
                            }
                        }
                    } else {
                        return Promise.reject(error);
                    }
                },
            );

            return instance;
        },
    };

    componentDidMount() {
        this.boostrapApp();
    }

    boostrapApp = async () => {
        let user = null,
            accessToken = null,
            refreshToken = null,
            isOnboardingCompleted = false;

        try {
            isOnboardingCompleted = await getOnboardingStatus();

            accessToken = await getUserToken();
            refreshToken = await getRefreshToken();

            if (accessToken) {
                try {
                    const { data } = await baseRequest.get("/user/profile", {
                        baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (data && data.status) {
                        user = data.data;
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        const { data } = await axios.post(
                            "/auth/refresh-token",
                            {},
                            {
                                baseURL:
                                    Config.environment === "production"
                                        ? Config.PROD_SERVER_URL
                                        : Config.DEV_SERVER_URL,
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                    "X-Refresh-Token": `Bearer ${refreshToken}`,
                                },
                            },
                        );

                        if (data && data.data && data.data.status) {
                            const { token, refreshToken } = data.data;

                            await Promise.all([saveUserToken(token), saveRefreshToken(refreshToken)]);

                            const { data: userData } = await baseRequest.get("/user/profile", {
                                baseURL:
                                    Config.environment === "production"
                                        ? Config.PROD_SERVER_URL
                                        : Config.DEV_SERVER_URL,
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            if (userData && userData.status) {
                                user = userData.data;
                            }

                            this.setState({
                                user,
                                refreshToken,
                                isLoading: false,
                                accessToken: token,
                            });
                        }
                    }
                }
            }
        } catch (e) {}

        const stateUpdate = { accessToken, refreshToken, user, isOnboardingCompleted, isLoading: false };

        this.setState(stateUpdate);
    };

    render() {
        return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>;
    }
}
