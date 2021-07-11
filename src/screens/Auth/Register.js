import React from "react";
import { useForm, Controller } from "react-hook-form";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { baseRequest, debugAxiosError } from "../../utils/request.utils";
import { AppMediumText, AppText, Button, FormErrorMessage, Page, PasswordField, TextField } from "../../components";

export const Register = ({ navigation }) => {
    const { authenticate } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (values) => {
        try {
            const { data } = await baseRequest.post("/user", values);

            if (data && data.data && data.data.status) {
                const { entity, token, refreshToken } = data.data;

                authenticate({ accessToken: token, refreshToken, user: entity });
            }
        } catch (error) {
            debugAxiosError(error);
        }
    };

    return (
        <Page>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                                render={({ field: { onChange, onBlur, value, ref }, fieldState: { invalid } }) => (
                                    <TextField
                                        ref={ref}
                                        value={value}
                                        error={invalid}
                                        onBlur={onBlur}
                                        returnKeyType="next"
                                        onChangeText={onChange}
                                        placeholder="First Name"
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
                                render={({ field: { onChange, onBlur, value, ref }, fieldState: { invalid } }) => (
                                    <TextField
                                        ref={ref}
                                        value={value}
                                        error={invalid}
                                        onBlur={onBlur}
                                        returnKeyType="next"
                                        onChangeText={onChange}
                                        placeholder="Last Name"
                                    />
                                )}
                            />
                            {errors.lastName && (
                                <AppText style={styles.fieldErrorText}>{errors.lastName.message}</AppText>
                            )}
                        </View>
                    </View>

                    <Controller
                        name="email"
                        defaultValue=""
                        control={control}
                        rules={{
                            required: "Email is required.",
                            pattern: {
                                message: "Invalid email address",
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
                            },
                        }}
                        render={({ field: { onChange, onBlur, value, ref }, fieldState: { invalid } }) => (
                            <TextField
                                ref={ref}
                                value={value}
                                error={invalid}
                                onBlur={onBlur}
                                returnKeyType="next"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                placeholder="Enter Email"
                                keyboardType="email-address"
                                style={{ marginTop: RFPercentage(2) }}
                            />
                        )}
                    />
                    {errors.email && <AppText style={styles.fieldErrorText}>{errors.email.message}</AppText>}

                    <Controller
                        defaultValue=""
                        control={control}
                        name="phoneNumber"
                        rules={{ required: "Phone number is required." }}
                        render={({ field: { onChange, onBlur, value, ref }, fieldState: { invalid } }) => (
                            <TextField
                                ref={ref}
                                value={value}
                                error={invalid}
                                onBlur={onBlur}
                                keyboardType="numeric"
                                onChangeText={onChange}
                                placeholder="Enter Phone Number"
                                style={{ marginTop: RFPercentage(2) }}
                            />
                        )}
                    />
                    {errors.phoneNumber && (
                        <AppText style={styles.fieldErrorText}>{errors.phoneNumber.message}</AppText>
                    )}

                    <Controller
                        name="password"
                        defaultValue=""
                        control={control}
                        rules={{ required: "Password is required." }}
                        render={({ field: { onChange, onBlur, value, ref }, fieldState: { invalid } }) => (
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
                </View>

                <Button
                    disabled={isSubmitting}
                    onPress={handleSubmit(onSubmit)}
                    label={isSubmitting ? "Processing..." : "Create Account"}
                />
                <View style={styles.registerActionBox}>
                    <AppText>Already signed up?</AppText>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <AppMediumText style={styles.singupLink}>Log In</AppMediumText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Page>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(2),
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
