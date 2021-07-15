import React, { useRef } from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { baseRequest, debugAxiosError, extractResponseErrorAsObject } from "../../utils/request.utils";
import { AppMediumText, AppText, Button, FormErrorMessage, Page, PasswordField, TextField } from "../../components";

export const Register = ({ navigation }) => {
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const phoneNumberRef = useRef();

    const { authenticate } = useAuth();

    const onSubmit = async (values, setErrors) => {
        try {
            const { data } = await baseRequest.post("/user", values);

            if (data && data.data && data.data.status) {
                const { entity, token, refreshToken } = data.data;

                authenticate({ accessToken: token, refreshToken, user: entity });
            }
        } catch (error) {
            debugAxiosError(error);
            setErrors(extractResponseErrorAsObject(error));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Page>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <AppMediumText style={styles.pageTitle}>Create Account</AppMediumText>
                    </View>

                    <Formik
                        onSubmit={onSubmit}
                        validateOnChange={false}
                        validationSchema={registrationSchema}
                        initialValues={{ firstName: "", lastName: "", email: "", password: "", phoneNumber: "" }}>
                        {({ handleChange, handleBlur, handleSubmit, isSubmitting, errors, values }) => (
                            <>
                                <View style={styles.form}>
                                    {errors.general ? <FormErrorMessage label={errors.general} /> : null}

                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <View style={{ width: "48%" }}>
                                            <TextField
                                                ref={firstNameRef}
                                                returnKeyType="next"
                                                placeholder="First Name"
                                                value={values.firstName}
                                                error={!!errors.firstName}
                                                onBlur={handleBlur("firstName")}
                                                onChangeText={handleChange("firstName")}
                                                onEndEditing={() => lastNameRef?.current?.focus()}
                                            />
                                            {errors.firstName && (
                                                <AppText style={styles.fieldErrorText}>{errors.firstName}</AppText>
                                            )}
                                        </View>

                                        <View style={{ width: "48%" }}>
                                            <TextField
                                                ref={lastNameRef}
                                                value={values.lastName}
                                                error={!!errors.lastName}
                                                onBlur={handleBlur("lastName")}
                                                returnKeyType="next"
                                                onChangeText={handleChange("lastName")}
                                                placeholder="Last Name"
                                                onEndEditing={() => emailRef?.current?.focus()}
                                            />
                                            {errors.lastName && (
                                                <AppText style={styles.fieldErrorText}>{errors.lastName}</AppText>
                                            )}
                                        </View>
                                    </View>

                                    <TextField
                                        ref={emailRef}
                                        returnKeyType="next"
                                        value={values.email}
                                        error={!!errors.email}
                                        autoCapitalize="none"
                                        placeholder="Enter Email"
                                        onBlur={handleBlur("email")}
                                        keyboardType="email-address"
                                        onChangeText={handleChange("email")}
                                        style={{ marginTop: RFPercentage(2) }}
                                        onEndEditing={() => phoneNumberRef?.current?.focus()}
                                    />
                                    {errors.email && <AppText style={styles.fieldErrorText}>{errors.email}</AppText>}

                                    <TextField
                                        ref={phoneNumberRef}
                                        returnKeyType="next"
                                        keyboardType="numeric"
                                        value={values.phoneNumber}
                                        error={!!errors.phoneNumber}
                                        placeholder="Enter Phone Number"
                                        onBlur={handleBlur("phoneNumber")}
                                        style={{ marginTop: RFPercentage(2) }}
                                        onChangeText={handleChange("phoneNumber")}
                                        onEndEditing={() => passwordRef?.current?.focus()}
                                    />
                                    {errors.phoneNumber && (
                                        <AppText style={styles.fieldErrorText}>{errors.phoneNumber}</AppText>
                                    )}

                                    <PasswordField
                                        ref={passwordRef}
                                        style={styles.input}
                                        autoCapitalize="none"
                                        value={values.password}
                                        error={!!errors.password}
                                        placeholder="Enter Password"
                                        onBlur={handleBlur("password")}
                                        onChangeText={handleChange("password")}
                                    />

                                    {errors.password && (
                                        <AppText style={styles.fieldErrorText}>{errors.password}</AppText>
                                    )}
                                </View>

                                <Button
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                    label={isSubmitting ? "Processing..." : "Create Account"}
                                />
                            </>
                        )}
                    </Formik>
                    <View style={styles.registerActionBox}>
                        <AppText>Already signed up?</AppText>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <AppMediumText style={styles.singupLink}>Log In</AppMediumText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Page>
        </SafeAreaView>
    );
};

const registrationSchema = object().shape({
    firstName: string().required("First name is required"),
    lastName: string().required("Last name is required"),
    phoneNumber: string().required("Phone number is required"),
    email: string().required("Email is required.").email("Enter valid email address").lowercase(),
    password: string().required("Password is required.").min(6),
});

const styles = StyleSheet.create({
    header: {
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(2),
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
