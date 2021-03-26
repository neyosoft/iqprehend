import React from "react";
import { useForm, Controller } from "react-hook-form";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import theme from "../../theme";
import { AppMediumText, AppText, Button, FormErrorMessage, Page, TextField } from "../../components";

export const ForgetPassword = ({ navigation }) => {
    const {
        control,
        errors,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm();

    const onSubmit = (values) => {
        console.log("The values: ", values);

        navigation.navigate("PasswordReset");
    };

    return (
        <Page>
            <View style={styles.header}>
                <AppText style={styles.pageTitle}>RECOVER PASSWORD</AppText>
            </View>
            <View style={styles.form}>
                <FormErrorMessage label="Something happened" />

                <AppText style={styles.description}>
                    Enter your email address and we'll send you a reset code to reset your password.
                </AppText>

                <Controller
                    name="email"
                    defaultValue=""
                    control={control}
                    rules={{
                        required: "Email is required.",
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
                            message: "invalid email address",
                        },
                    }}
                    render={({ onChange, onBlur, value, ref }, { invalid }) => (
                        <TextField
                            ref={ref}
                            value={value}
                            error={invalid}
                            onBlur={onBlur}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="Enter Email"
                            onChangeText={(value) => onChange(value)}
                        />
                    )}
                />
                {errors.email && <AppText style={styles.fieldErrorText}>{errors.email.message}</AppText>}
            </View>

            <Button disabled={isSubmitting} label="Send Reset Code" onPress={handleSubmit(onSubmit)} />

            <TouchableOpacity style={styles.loginBtnLink} onPress={() => navigation.navigate("Login")}>
                <AppText>Back to </AppText>
                <AppMediumText style={styles.loginLink}>Log In</AppMediumText>
            </TouchableOpacity>
        </Page>
    );
};

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
