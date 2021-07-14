import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { Component, useContext } from "react";

import {
    getUserToken,
    saveUserToken,
    getRefreshToken,
    removeUserToken,
    saveRefreshToken,
    removeRefreshToken,
} from "../utils/storage.utils";
import Config from "../../config";
import { isFuture } from "date-fns";
import { baseRequest, debugAxiosError } from "../utils/request.utils";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export default class AuthProvider extends Component {
    state = {
        user: null,
        isLoading: true,
        accessToken: null,
        refreshToken: null,

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
        setupCompleted: () => this.setState({ accountSetupCompleted: true }),
        setupNotCompleted: () => this.setState({ accountSetupCompleted: false }),
        authenticatedRequest: () => {
            const { accessToken, refreshToken } = this.state;

            const instance = axios.create({
                baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            instance.interceptors.request.use(async (config) => {
                const decoded = jwt_decode(accessToken);

                if (isFuture(new Date(decoded.exp * 1000))) {
                    return config;
                } else {
                    const { data } = await axios.post("/auth/refresh-token", params, {
                        baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
                        headers: {
                            Authorization: accessToken,
                            "X-Refresh-Token": refreshToken,
                        },
                    });

                    if (data && data.data && data.data.status) {
                        const { accessToken, refreshToken } = data.data;

                        await Promise.all([saveUserToken(accessToken), saveRefreshToken(refreshToken)]);

                        this.setState({ accessToken, refreshToken });

                        config.headers["Authorization"] = "Bearer " + accessToken;

                        return config;
                    }
                }
            });

            return instance;
        },
    };

    componentDidMount() {
        this.boostrapApp();
    }

    boostrapApp = async () => {
        let user = null,
            accessToken = null,
            refreshToken = null;

        try {
            accessToken = await getUserToken();
            refreshToken = await getRefreshToken();

            if (accessToken) {
                const decoded = jwt_decode(accessToken);

                if (isFuture(new Date(decoded.exp * 1000))) {
                    try {
                        console.log("attempting to auto-login");
                        const { data } = await baseRequest.get("/user/profile", {
                            baseURL:
                                Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });

                        console.log("User successfully authenticated: ", data);

                        if (data && data.status) {
                            user = data.data;
                        }
                    } catch (e) {
                        debugAxiosError(e);
                        console.log("There is a problem completing login: ", e);
                        ß;
                    }
                } else {
                    console.log("Token already expired.");
                    const { data } = await axios.post("/auth/refresh-token", params, {
                        baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
                        headers: {
                            Authorization: accessToken,
                            "X-Refresh-Token": refreshToken,
                        },
                    });

                    if (data && data.data && data.data.status) {
                        const { accessToken, refreshToken } = data.data;

                        await Promise.all([saveUserToken(accessToken), saveRefreshToken(refreshToken)]);

                        const { data: userData } = await baseRequest.get("/user/profile", {
                            baseURL:
                                Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });

                        if (userData && userData.status) {
                            user = userData.data;
                        }

                        this.setState({
                            user,
                            accessToken,
                            refreshToken,
                            isLoading: false,
                        });
                    }
                }
            }
        } catch (e) {}

        const stateUpdate = { accessToken, refreshToken, user, isLoading: false };

        this.setState(stateUpdate);
    };

    render() {
        return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>;
    }
}
