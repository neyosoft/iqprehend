import axios from "axios";

import Config from "../../config";

const instance = axios.create({
    baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
});

export const baseRequest = instance;

export const authenticatedRequest = (token) => {
    const instance = axios.create({
        baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return instance;
};

export const extractResponseErrorMessage = (
    error,
    defaultMessage = "Unable to process the request. Kindly check your internet connectivity.",
) => {
    if (error.response) {
        const { response } = error;
        if (response.data && response.data.data && response.data.data.message) {
            return response.data.data.message;
        } else {
            return defaultMessage;
        }
    } else if (error.request) {
        return defaultMessage;
    } else {
        return error.message;
    }
};

export const extractResponseErrorAsObject = (
    error,
    defaultMessage = "Unable to process the request. Kindly check your internet connectivity.",
) => {
    if (error.response) {
        const { response } = error;
        if (response.data && response.data.errors) {
            return response.data.errors;
        } else if (response.data && response.data.data && response.data.data.message) {
            return { general: response.data.data.message };
        } else {
            return { general: defaultMessage };
        }
    } else if (error.request) {
        return { general: defaultMessage };
    } else {
        return { general: error.message };
    }
};

export const debugAxiosError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Response Data: ", error.response.data);
        console.log("Response Status: ", error.response.status);
        console.log("Response Header: ", error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("Request: ", error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
    }

    console.log("Config: ", error.config);
};
