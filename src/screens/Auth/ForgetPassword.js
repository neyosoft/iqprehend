import React from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { useToast } from "react-native-fast-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { baseRequest, extractResponseErrorMessage } from "../../utils/request.utils";

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
            setFieldError("general", extractResponseErrorMessage(error));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Page>
                <View style={styles.header}>
                    <Icon
                        color="#060169"
                        name="arrow-left"
                        size={RFPercentage(3.5)}
                        onPress={() => navigation.navigate("Login")}
                    />
                    <AppMediumText style={styles.pageTitle}>Forget Password</AppMediumText>
                    <AppText style={styles.pageDescription}>
                        Please enter your registered email address and we’ll send a link to reset your password
                    </AppText>
                </View>

                <Formik initialValues={{ email: "" }} onSubmit={onSubmit} validationSchema={forgetPasswordSchema}>
                    {({ handleSubmit, handleBlur, handleChange, values, errors, isSubmitting }) => (
                        <>
                            <View style={styles.form}>
                                {errors.general ? <FormErrorMessage label={errors.general} /> : null}

                                <TextField
                                    value={values.email}
                                    autoCapitalize="none"
                                    error={!!errors.email}
                                    keyboardType="email-address"
                                    onBlur={handleBlur("email")}
                                    placeholder="johndoe@yahoo.com"
                                    onChangeText={handleChange("email")}
                                />
                                {errors.email && <AppText style={styles.fieldErrorText}>{errors.email}</AppText>}
                            </View>

                            <Button
                                label="Reset Password"
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                                style={{ marginTop: RFPercentage(3) }}
                            />
                        </>
                    )}
                </Formik>
            </Page>
        </SafeAreaView>
    );
};

const forgetPasswordSchema = () =>
    object().shape({
        email: string().required("Email is required.").email().lowercase(),
    });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        marginTop: RFPercentage(4),
        marginVertical: RFPercentage(2),
    },
    pageTitle: {
        color: theme.colors.primary,
        fontSize: RFPercentage(4),
        marginTop: RFPercentage(2),
    },
    pageDescription: {
        width: "80%",
        color: "#6A6A6A",
        lineHeight: RFPercentage(2.5),
        marginTop: 10,
    },
    input: {
        marginTop: RFPercentage(2),
    },
    form: {
        marginVertical: RFPercentage(2),
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
