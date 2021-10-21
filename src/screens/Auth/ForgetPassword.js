import React from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { useToast } from "react-native-fast-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { baseRequest, debugAxiosError, extractResponseErrorMessage } from "../../utils/request.utils";

import theme from "../../theme";
import { AppMediumText, AppText, Button, FormErrorMessage, Page, TextField } from "../../components";

export const ForgetPassword = ({ navigation }) => {
    const toast = useToast();

    const onSubmit = async (values, { setFieldError }) => {
        try {
            const { data } = await baseRequest.post("/auth/request-password-reset", { email: values.email });

            if (data && data.data) {
                toast.show(data.data.message);

                navigation.navigate("PasswordReset", { code: data.data.code });
            } else {
                throw new Error();
            }
        } catch (error) {
            debugAxiosError(error);
            setFieldError("general", extractResponseErrorMessage(error));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Page>
                <View style={styles.header}>
                    <AppMediumText style={styles.pageTitle}>RECOVER PASSWORD</AppMediumText>
                </View>

                <Formik initialValues={{ email: "" }} onSubmit={onSubmit} validationSchema={forgetPasswordSchema}>
                    {({ handleSubmit, handleBlur, handleChange, values, errors, isSubmitting }) => (
                        <>
                            <View style={styles.form}>
                                {errors.general ? <FormErrorMessage label={errors.general} /> : null}

                                <AppText style={styles.description}>
                                    Enter your email address and we'll send you a reset code to reset your password.
                                </AppText>

                                <TextField
                                    value={values.email}
                                    autoCapitalize="none"
                                    error={!!errors.email}
                                    placeholder="Enter Email"
                                    keyboardType="email-address"
                                    onBlur={handleBlur("email")}
                                    onChangeText={handleChange("email")}
                                />
                                {errors.email && <AppText style={styles.fieldErrorText}>{errors.email}</AppText>}
                            </View>

                            <Button disabled={isSubmitting} label="Send Reset Code" onPress={handleSubmit} />
                        </>
                    )}
                </Formik>

                <TouchableOpacity style={styles.loginBtnLink} onPress={() => navigation.navigate("Login")}>
                    <AppText>Back to </AppText>
                    <AppMediumText style={styles.loginLink}>Log In</AppMediumText>
                </TouchableOpacity>
            </Page>
        </SafeAreaView>
    );
};

const forgetPasswordSchema = () =>
    object().shape({
        email: string().required("Email is required.").email().lowercase(),
    });

const styles = StyleSheet.create({
    header: {
        marginTop: RFPercentage(1),
        marginVertical: RFPercentage(2),
    },
    pageTitle: {
        fontSize: RFPercentage(3),
        color: theme.colors.primary,
    },
    input: {
        marginTop: RFPercentage(2),
    },
    description: {
        color: "#787878",
        fontSize: RFPercentage(2),
        marginBottom: RFPercentage(3),
    },
    form: {
        marginVertical: RFPercentage(6),
    },
    loginBtnLink: {
        marginTop: RFPercentage(2),
        flexDirection: "row",
        alignItems: "center",
    },
    loginLink: {
        marginLeft: 3,
        color: theme.colors.primary,
    },
    fieldErrorText: {
        marginTop: 3,
        color: "#FF7878",
        fontSize: RFPercentage(1.8),
    },
});
