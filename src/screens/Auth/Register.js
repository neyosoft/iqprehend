import React, { useRef, useState } from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { baseRequest, extractResponseErrorAsObject } from "../../utils/request.utils";
import {
    Page,
    Button,
    AppText,
    Checkbox,
    TextField,
    AppMediumText,
    PasswordField,
    FormErrorMessage,
} from "../../components";

export const Register = ({ navigation }) => {
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const phoneNumberRef = useRef();

    const { authenticate } = useAuth();

    const [agreement, setAgreement] = useState(false);

    const onSubmit = async (values, { setErrors }) => {
        try {
            const { data } = await baseRequest.post("/user", values);

            if (data && data.data && data.data.status) {
                const { entity, token, refreshToken } = data.data;

                authenticate({ accessToken: token, refreshToken, user: entity });
            }
        } catch (error) {
            setErrors(extractResponseErrorAsObject(error));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Page>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Icon
                            name="arrow-left"
                            color="#060169"
                            size={RFPercentage(3.5)}
                            onPress={() => navigation.navigate("Login")}
                        />
                        <AppMediumText style={styles.pageTitle}>Create New Account</AppMediumText>
                        <AppText style={styles.pageDescription}>
                            Please fill the following field to create a new account
                        </AppText>
                    </View>

                    <Formik
                        onSubmit={onSubmit}
                        validateOnChange={false}
                        validationSchema={registrationSchema}
                        initialValues={{ firstName: "", lastName: "", email: "", password: "", phoneNumber: "" }}>
                        {({ handleChange, handleBlur, handleSubmit, isSubmitting, errors, values, touched }) => (
                            <>
                                <View>
                                    {errors.general ? <FormErrorMessage label={errors.general} /> : null}

                                    <TextField
                                        ref={firstNameRef}
                                        returnKeyType="next"
                                        placeholder="First Name"
                                        value={values.firstName}
                                        onBlur={handleBlur("firstName")}
                                        style={{ marginTop: RFPercentage(2) }}
                                        onChangeText={handleChange("firstName")}
                                        error={errors.firstName && touched.firstName}
                                        onEndEditing={() => lastNameRef?.current?.focus()}
                                    />
                                    {errors.firstName && touched.firstName && (
                                        <AppText style={styles.fieldErrorText}>{errors.firstName}</AppText>
                                    )}

                                    <TextField
                                        ref={lastNameRef}
                                        returnKeyType="next"
                                        placeholder="Last Name"
                                        value={values.lastName}
                                        onBlur={handleBlur("lastName")}
                                        style={{ marginTop: RFPercentage(2) }}
                                        onChangeText={handleChange("lastName")}
                                        error={errors.lastName && touched.lastName}
                                        onEndEditing={() => emailRef?.current?.focus()}
                                    />
                                    {errors.lastName && touched.lastName && (
                                        <AppText style={styles.fieldErrorText}>{errors.lastName}</AppText>
                                    )}

                                    <TextField
                                        ref={emailRef}
                                        returnKeyType="next"
                                        value={values.email}
                                        autoCapitalize="none"
                                        placeholder="Email Address"
                                        onBlur={handleBlur("email")}
                                        keyboardType="email-address"
                                        onChangeText={handleChange("email")}
                                        error={touched.email && errors.email}
                                        style={{ marginTop: RFPercentage(2) }}
                                        onEndEditing={() => phoneNumberRef?.current?.focus()}
                                    />
                                    {touched.email && errors.email && (
                                        <AppText style={styles.fieldErrorText}>{errors.email}</AppText>
                                    )}

                                    <TextField
                                        ref={phoneNumberRef}
                                        returnKeyType="next"
                                        keyboardType="numeric"
                                        value={values.phoneNumber}
                                        placeholder="Phone Number"
                                        onBlur={handleBlur("phoneNumber")}
                                        style={{ marginTop: RFPercentage(2) }}
                                        onChangeText={handleChange("phoneNumber")}
                                        error={errors.phoneNumber && touched.phoneNumber}
                                        onEndEditing={() => passwordRef?.current?.focus()}
                                    />
                                    {errors.phoneNumber && touched.phoneNumber && (
                                        <AppText style={styles.fieldErrorText}>{errors.phoneNumber}</AppText>
                                    )}

                                    <PasswordField
                                        ref={passwordRef}
                                        style={styles.input}
                                        autoCapitalize="none"
                                        value={values.password}
                                        placeholder="Enter Password"
                                        onBlur={handleBlur("password")}
                                        onChangeText={handleChange("password")}
                                        error={errors.password && touched.password}
                                    />

                                    {errors.password && touched.password && (
                                        <AppText style={styles.fieldErrorText}>{errors.password}</AppText>
                                    )}
                                </View>

                                <View style={styles.termContainer}>
                                    <Checkbox checked={agreement} onPress={() => setAgreement(!agreement)} />
                                    <AppText style={styles.agreementText} onPress={() => setAgreement(!agreement)}>
                                        By signing up, you agree to our{" "}
                                        <AppMediumText
                                            onPress={() =>
                                                Linking.openURL("https://web.iqprehend.herlabytes.com/privacy")
                                            }>
                                            Privacy Policy
                                        </AppMediumText>{" "}
                                        and{" "}
                                        <AppMediumText
                                            onPress={() =>
                                                Linking.openURL("https://web.iqprehend.herlabytes.com/terms")
                                            }>
                                            terms of service
                                        </AppMediumText>
                                    </AppText>
                                </View>

                                <Button
                                    style={styles.button}
                                    onPress={handleSubmit}
                                    disabled={!agreement || isSubmitting}
                                    label={isSubmitting ? "Processing..." : "Create Account"}
                                />
                            </>
                        )}
                    </Formik>
                    <View style={styles.registerActionBox}>
                        <AppText>Existing User?</AppText>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <AppMediumText style={styles.singupLink}>Log in here</AppMediumText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Page>
        </SafeAreaView>
    );
};

const registrationSchema = object().shape({
    firstName: string()
        .required("First name is required")
        .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field "),
    lastName: string()
        .required("Last name is required")
        .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field "),
    phoneNumber: string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Only digits are allowed for this field ")
        .length(11, "Invalid Phone number. Phone number must be 11 Characters"),
    email: string()
        .required("Email is required.")
        .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "You provided invalid email.",
        )
        .lowercase(),
    password: string().required("Password is required.").min(6),
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
        color: theme.colors.blue,
        fontSize: RFPercentage(4),
        marginTop: RFPercentage(2),
    },
    pageDescription: {
        width: "72%",
        color: "#6A6A6A",
        lineHeight: RFPercentage(2.5),
        marginTop: 10,
    },
    input: {
        marginTop: RFPercentage(2),
    },
    registerActionBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: RFPercentage(2),
    },
    singupLink: {
        marginLeft: RFPercentage(1),
        color: theme.colors.blue,
    },
    fieldErrorText: {
        marginTop: 3,
        color: "#FF7878",
        fontSize: RFPercentage(1.8),
    },
    termContainer: {
        flexDirection: "row",
        marginVertical: RFPercentage(2),
    },
    agreementText: {
        marginLeft: 10,
        color: "#6A6A6A",
    },
    button: {
        marginTop: RFPercentage(2),
    },
});
