import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RFPercentage } from "react-native-responsive-fontsize";

import theme from "../../theme";
import { AppBoldText, AppText, Button, FormErrorMessage, Page, PasswordField, TextField } from "../../components";

export const Login = () => {
    const {
        handleSubmit,
        control,
        errors,
        formState: { isSubmitting },
    } = useForm();

    const onSubmit = (values) => {
        console.log("The values: ", values);
    };

    return (
        <Page>
            <View style={styles.header}>
                <AppText style={styles.pageTitle}>Sign In</AppText>
            </View>
            <View style={styles.form}>
                <FormErrorMessage label="Something happened" />

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
                            placeholder="Enter Email"
                            onChangeText={(value) => onChange(value)}
                        />
                    )}
                />
                {errors.email && <AppText style={styles.fieldErrorText}>{errors.email.message}</AppText>}

                <Controller
                    name="password"
                    defaultValue=""
                    control={control}
                    rules={{ required: "Password is required." }}
                    render={({ onChange, onBlur, value, ref }, { invalid }) => (
                        <PasswordField
                            ref={ref}
                            value={value}
                            error={invalid}
                            onBlur={onBlur}
                            style={styles.input}
                            placeholder="Enter Password"
                            onChangeText={(value) => onChange(value)}
                        />
                    )}
                />

                {errors.password && <AppText style={styles.fieldErrorText}>{errors.password.message}</AppText>}

                <AppBoldText style={styles.forgetPassword}>Forget Password?</AppBoldText>
            </View>

            <Button disabled={isSubmitting} label="Log In" onPress={handleSubmit(onSubmit)} />

            <View style={styles.registerActionBox}>
                <AppText>Don't have an account?</AppText>
                <AppBoldText style={styles.singupLink}>Sign Up</AppBoldText>
            </View>
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
