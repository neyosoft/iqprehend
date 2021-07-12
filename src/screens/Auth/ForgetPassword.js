import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Formik } from "formik";
import { object, string } from "yup";
import { SafeAreaView } from "react-native-safe-area-context";

import theme from "../../theme";
import { AppMediumText, AppText, Button, FormErrorMessage, Page, TextField } from "../../components";

export const ForgetPassword = ({ navigation }) => {
    const onSubmit = (values) => {
        console.log("The values: ", values);

        navigation.navigate("PasswordReset");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Page>
                <View style={styles.header}>
                    <AppText style={styles.pageTitle}>RECOVER PASSWORD</AppText>
                </View>
                <Formik initialValues={{ email: "" }} onSubmit={onSubmit} validationSchema={forgetPasswordSchema}>
                    {({ handleSubmit, handleBlur, handleChange, values, errors, isSubmitting }) => (
                        <>
                            <View style={styles.form}>
                                <FormErrorMessage label="Something happened" />

                                <AppText style={styles.description}>
                                    Enter your email address and we'll send you a reset code to reset your password.
                                </AppText>

                                <TextField
                                    value={values.email}
                                    error={!!errors.email}
                                    onBlur={handleBlur("email")}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    placeholder="Enter Email"
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
        color: theme.colors.secondary,
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
