import React from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import theme from "../../theme";
import { useAuth } from "../../context";
import { baseRequest, extractResponseErrorMessage } from "../../utils/request.utils";
import { Page, AppText, Button, TextField, AppMediumText, PasswordField, FormErrorMessage } from "../../components";

export const Login = ({ navigation }) => {
    const { authenticate } = useAuth();

    const onSubmit = async (values, { setFieldError }) => {
        try {
            const { data } = await baseRequest.post("/auth/login", values);

            if (data && data.data) {
                const { user, token, refreshToken } = data.data;

                await authenticate({ accessToken: token, refreshToken, user });
            }
        } catch (error) {
            setFieldError("general", extractResponseErrorMessage(error, "Invalid email or password."));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Page>
                <View style={styles.header}>
                    <AppText style={styles.pageTitle}>Sign In</AppText>
                </View>
                <Formik initialValues={{ email: "", password: "" }} onSubmit={onSubmit} validationSchema={loginSchema}>
                    {({ handleChange, handleBlur, handleSubmit, isSubmitting, errors, values }) => (
                        <>
                            <View style={styles.form}>
                                {errors.general ? <FormErrorMessage label={errors.general} /> : null}

                                <TextField
                                    value={values.email}
                                    error={!!errors.email}
                                    autoCapitalize="none"
                                    placeholder="Enter Email"
                                    onBlur={handleBlur("email")}
                                    keyboardType="email-address"
                                    onChangeText={handleChange("email")}
                                />
                                {errors.email && <AppText style={styles.fieldErrorText}>{errors.email}</AppText>}

                                <PasswordField
                                    style={styles.input}
                                    autoCapitalize="none"
                                    value={values.password}
                                    error={!!errors.password}
                                    placeholder="Enter Password"
                                    onBlur={handleBlur("password")}
                                    onChangeText={handleChange("password")}
                                />

                                {errors.password && <AppText style={styles.fieldErrorText}>{errors.password}</AppText>}

                                <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
                                    <AppMediumText style={styles.forgetPassword}>Forget Password?</AppMediumText>
                                </TouchableOpacity>
                            </View>

                            <Button disabled={isSubmitting} label="Log In" onPress={handleSubmit} />
                        </>
                    )}
                </Formik>

                <View style={styles.registerActionBox}>
                    <AppText>Don't have an account?</AppText>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <AppMediumText style={styles.singupLink}>Sign Up</AppMediumText>
                    </TouchableOpacity>
                </View>
            </Page>
        </SafeAreaView>
    );
};

const loginSchema = object().shape({
    email: string().required("Email is required.").email("Enter valid email address").lowercase(),
    password: string().required("Password is required.").min(6),
});

const styles = StyleSheet.create({
    header: {
        marginTop: RFPercentage(1),
        marginVertical: RFPercentage(2),
    },
    pageTitle: {
        fontSize: RFPercentage(3),
        color: theme.colors.secondary,
    },
    input: {
        marginTop: RFPercentage(2),
    },
    form: {
        marginVertical: RFPercentage(6),
    },
    forgetPassword: {
        color: "#000",
        fontSize: RFPercentage(2),
        marginTop: RFPercentage(2),
    },
    registerActionBox: {
        marginTop: RFPercentage(2),
        flexDirection: "row",
        alignItems: "center",
    },
    singupLink: {
        marginLeft: RFPercentage(1),
        color: theme.colors.primary,
    },
    fieldErrorText: {
        marginTop: 3,
        color: "#FF7878",
        fontSize: RFPercentage(1.8),
    },
});
