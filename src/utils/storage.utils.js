import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_TOKEN_KEY = "userToken";
const USER_REFRESH_TOKEN_KEY = "userRefreshToken";

const BIOMETRIC_AUTH = "BIOMETRIC_AUTH";
const ONBOARDING_COMPLETED = "ONBOARDING_COMPLETED";

export const saveUserToken = (token) => AsyncStorage.setItem(USER_TOKEN_KEY, token);
export const getUserToken = () => AsyncStorage.getItem(USER_TOKEN_KEY);
export const removeUserToken = () => AsyncStorage.removeItem(USER_TOKEN_KEY);

export const saveRefreshToken = (token) => AsyncStorage.setItem(USER_REFRESH_TOKEN_KEY, token);
export const getRefreshToken = () => AsyncStorage.getItem(USER_REFRESH_TOKEN_KEY);
export const removeRefreshToken = () => AsyncStorage.removeItem(USER_REFRESH_TOKEN_KEY);

export const removeOnboardingStatus = () => AsyncStorage.removeItem(ONBOARDING_COMPLETED);
export const onboardingCompleted = () => AsyncStorage.setItem(ONBOARDING_COMPLETED, "TRUE");
export const getOnboardingStatus = async () => {
    const status = await AsyncStorage.getItem(ONBOARDING_COMPLETED);

    return status === "TRUE";
};

export const saveBiometricLogin = (payload) => AsyncStorage.setItem(BIOMETRIC_AUTH, JSON.stringify(payload));
export const getBiometricLogin = () => AsyncStorage.getItem(BIOMETRIC_AUTH);
