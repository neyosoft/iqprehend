import React from "react";
import { useForm, Controller } from "react-hook-form";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import theme from "../../theme";
import { useAuth } from "../../context";
import { baseRequest, debugAxiosError } from "../../utils/request.utils";
import { Page, AppText, Button, TextField, AppMediumText, PasswordField, FormErrorMessage } from "../../components";

export const Login = ({ navigation }) => {
    const { authenticate } = useAuth();

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: { email: "", password: "" } });

    const onSubmit = (values) => {
        console.log("The values: ", values);

        try {
            const { data } = await baseRequest.post("/auth/login", values);

            if (data && data.data && data.data.status) {
                const { user, token, refreshToken } = data.data;

                authenticate({ accessToken: token, refreshToken, user });
            }
        } catch (error) {
            debugAxiosError(error);
        }
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
                    control={control}
                    rules={{
                        required: "Email is required.",
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
                            message: "invalid email address",
                        },
                    }}
                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { invalid } }) => (
                        <TextField
                            ref={ref}
                            value={value}
                            error={invalid}
                            onBlur={onBlur}
                            autoCapitalize="none"
                            onChangeText={onChange}
                            placeholder="Enter Email"
                            keyboardType="email-address"
                        />
                    )}
                />
                {errors.email && <AppText style={styles.fieldErrorText}>{errors.email.message}</AppText>}

                <Controller
                    name="password"
                    control={control}
                    rules={{ required: "Password is required." }}
                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { invalid } }) => (
                        <PasswordField
                            ref={ref}
                            value={value}
                            error={invalid}
                            onBlur={onBlur}
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={onChange}
                            placeholder="Enter Password"
                        />
                    )}
                />

                {errors.password && <AppText style={styles.fieldErrorText}>{errors.password.message}</AppText>}

                <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
                    <AppMediumText style={styles.forgetPassword}>Forget Password?</AppMediumText>
                </TouchableOpacity>
            </View>

            <Button disabled={isSubmitting} label="Log In" onPress={handleSubmit(onSubmit)} />

            <View style={styles.registerActionBox}>
                <AppText>Don't have an account?</AppText>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <AppMediumText style={styles.singupLink}>Sign Up</AppMediumText>
                </TouchableOpacity>
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
