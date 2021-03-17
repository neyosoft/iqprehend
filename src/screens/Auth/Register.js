import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RFPercentage } from "react-native-responsive-fontsize";

import theme from "../../theme";
import { AppBoldText, AppText, Button, FormErrorMessage, Page, PasswordField, TextField } from "../../components";

export const Register = () => {
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
        <Page style={styles.page}>
            <View style={styles.header}>
                <AppText style={styles.pageTitle}>Create Account</AppText>
            </View>
            <View style={styles.form}>
                <FormErrorMessage label="Something happened" />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ width: "48%" }}>
                        <Controller
                            name="firstName"
                            defaultValue=""
                            control={control}
                            rules={{ required: "First name is required." }}
                            render={({ onChange, onBlur, value, ref }, { invalid }) => (
                                <TextField
                                    ref={ref}
                                    value={value}
                                    error={invalid}
                                    onBlur={onBlur}
                                    placeholder="Enter First Name"
                                    onChangeText={(value) => onChange(value)}
                                />
                            )}
                        />
                        {errors.firstName && (
                            <AppText style={styles.fieldErrorText}>{errors.firstName.message}</AppText>
                        )}
                    </View>

                    <View style={{ width: "48%" }}>
                        <Controller
                            name="lastName"
                            defaultValue=""
                            control={control}
                            rules={{ required: "Last name is required." }}
                            render={({ onChange, onBlur, value, ref }, { invalid }) => (
                                <TextField
                                    ref={ref}
                                    value={value}
                                    error={invalid}
                                    onBlur={onBlur}
                                    placeholder="Enter Last Name"
                                    onChangeText={(value) => onChange(value)}
                                />
                            )}
                        />
                        {errors.lastName && <AppText style={styles.fieldErrorText}>{errors.lastName.message}</AppText>}
                    </View>
                </View>

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
                            style={{ marginTop: RFPercentage(2) }}
                            onChangeText={(value) => onChange(value)}
                        />
                    )}
                />
                {errors.email && <AppText style={styles.fieldErrorText}>{errors.email.message}</AppText>}

                <Controller
                    name="phoneNumber"
                    defaultValue=""
                    control={control}
                    rules={{ required: "Phone number is required." }}
                    render={({ onChange, onBlur, value, ref }, { invalid }) => (
                        <TextField
                            ref={ref}
                            value={value}
                            error={invalid}
                            onBlur={onBlur}
                            placeholder="Enter Phone Number"
                            style={{ marginTop: RFPercentage(2) }}
                            onChangeText={(value) => onChange(value)}
                        />
                    )}
                />
                {errors.phoneNumber && <AppText style={styles.fieldErrorText}>{errors.phoneNumber.message}</AppText>}

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

                <Controller
                    defaultValue=""
                    control={control}
                    name="confirmPassword"
                    rules={{ required: "Password is required." }}
                    render={({ onChange, onBlur, value, ref }, { invalid }) => (
                        <PasswordField
                            ref={ref}
                            value={value}
                            error={invalid}
                            onBlur={onBlur}
                            style={styles.input}
                            placeholder="Confirm Password"
                            onChangeText={(value) => onChange(value)}
                        />
                    )}
                />

                {errors.confirmPassword && (
                    <AppText style={styles.fieldErrorText}>{errors.confirmPassword.message}</AppText>
                )}
            </View>

            <Button disabled={isSubmitting} label="Create Account" onPress={handleSubmit(onSubmit)} />
            <View style={styles.registerActionBox}>
                <AppText>Already signed up?</AppText>
                <AppBoldText style={styles.singupLink}>Log In</AppBoldText>
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
