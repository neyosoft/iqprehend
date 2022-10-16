import React from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { useToast } from "react-native-fast-toast";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";

import { baseRequest, extractResponseErrorMessage } from "../../utils/request.utils";

import theme from "../../theme";
import { useAuth } from "../../context";
import { AppMediumText, AppText, Button, FormErrorMessage, Page, TextField } from "../../components";

export const RegistrationOTP = ({ navigation }) => {
    const toast = useToast();
    const { authenticate } = useAuth();

    const onSubmit = async (values, { setFieldError }) => {
        try {
            const { data } = await baseRequest.post("/user/verify", values);

            console.log("The data: ", data.data);

            if (data?.data && data.data.status) {
                toast.show("Registration completed.");

                const { entity, token, refreshToken } = data.data;

                authenticate({ accessToken: token, refreshToken, user: entity });
            }
        } catch (error) {
            setFieldError("general", extractResponseErrorMessage(error, "Verification failed."));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Page style={styles.page}>
                <Formik
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validationSchema={resetSchema}
                    initialValues={{ code: "" }}>
                    {({ handleSubmit, handleBlur, handleChange, values, errors, touched, isSubmitting }) => (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.header}>
                                <AppMediumText style={styles.pageTitle}>Set a new password</AppMediumText>
                            </View>
                            <View style={styles.form}>
                                {errors.general ? <FormErrorMessage label={errors.general} /> : null}

                                <AppText style={styles.description}>
                                    We recommend using a mix of upper and lower case, special characters and numbers.
                                </AppText>

                                <TextField
                                    maxLength={6}
                                    value={values.code}
                                    keyboardType="number-pad"
                                    onBlur={handleBlur("code")}
                                    placeholder="Enter reset code"
                                    error={touched.code && errors.code}
                                    onChangeText={handleChange("code")}
                                    style={{ marginTop: RFPercentage(2) }}
                                />
                                {touched.code && errors.code && (
                                    <AppText style={styles.fieldErrorText}>{errors.code}</AppText>
                                )}
                            </View>

                            <Button
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                                label={isSubmitting ? "Processing..." : "Verify Account"}
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
    code: string()
        .length(6)
        .required("OTP code is required.")
        .matches(/^[0-9]+$/, "Only digits are allowed for this field "),
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
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
