import React from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { useToast } from "react-native-fast-toast";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { baseRequest, extractResponseErrorMessage } from "../../utils/request.utils";

import theme from "../../theme";
import { AppMediumText, AppText, Button, FormErrorMessage, Page, PasswordField, TextField } from "../../components";

export const PasswordReset = ({ navigation, route }) => {
    const { code } = route.params;

    const toast = useToast();

    const onSubmit = async (values, { setFieldError }) => {
        try {
            const { data: linkVerificationData, headers } = await baseRequest.get("/auth/verify-link", {
                params: { resetLink: values.code },
            });

            if (!(linkVerificationData && linkVerificationData.data)) {
                throw new Error();
            }

            const { data } = await baseRequest.put(
                "/auth/reset-password",
                { password: values.password },
                { headers: { "X-Submission-Token": headers["x-submission-token"] } },
            );

            if (data && data.data) {
                toast.show(data.data.message);

                navigation.navigate("PasswordResetSuccessful");
            }
        } catch (error) {
            setFieldError("general", extractResponseErrorMessage(error));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Page style={styles.page}>
                <Formik
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validationSchema={resetSchema}
                    initialValues={{ password: "", code: "" }}>
                    {({ handleSubmit, handleBlur, handleChange, values, errors, isSubmitting }) => (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.header}>
                                <AppMediumText style={styles.pageTitle}>Set a new password</AppMediumText>
                            </View>
                            <View style={styles.form}>
                                {errors.general ? <FormErrorMessage label={errors.general} /> : null}

                                <View>
                                    <AppText>Verification code: {code}</AppText>
                                </View>

                                <AppText style={styles.description}>
                                    We recommend using a mix of upper and lower case, special characters and numbers.
                                </AppText>

                                <TextField
                                    maxLength={6}
                                    value={values.code}
                                    error={!!errors.code}
                                    keyboardType="number-pad"
                                    onBlur={handleBlur("code")}
                                    placeholder="Enter reset code"
                                    onChangeText={handleChange("code")}
                                    style={{ marginTop: RFPercentage(2) }}
                                />
                                {errors.code && <AppText style={styles.fieldErrorText}>{errors.code}</AppText>}

                                <PasswordField
                                    style={styles.input}
                                    autoCapitalize="none"
                                    value={values.password}
                                    error={!!errors.password}
                                    placeholder="New password"
                                    onBlur={handleBlur("password")}
                                    onChangeText={handleChange("password")}
                                />

                                {errors.password && <AppText style={styles.fieldErrorText}>{errors.password}</AppText>}
                            </View>

                            <Button
                                disabled={isSubmitting}
                                onPress={handleSubmit}
                                label={isSubmitting ? "Processing..." : "Reset Password"}
                            />

                            <View style={styles.registerActionBox}>
                                <AppText>Already signed up?</AppText>
                                <AppMediumText style={styles.singupLink} onPress={() => navigation.navigate("Login")}>
                                    Log In
                                </AppMediumText>
                            </View>
                        </ScrollView>
                    )}
                </Formik>
            </Page>
        </SafeAreaView>
    );
};

const resetSchema = object().shape({
    code: string().required("Reset code is required.").length(6),
    password: string().required("Password is required.").min(6),
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
    form: {
        marginVertical: RFPercentage(6),
    },
    description: {
        color: "#787878",
        fontSize: RFPercentage(2),
        marginBottom: RFPercentage(3),
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
