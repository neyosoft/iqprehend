import React from "react";
import { useForm, Controller } from "react-hook-form";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";

import theme from "../../theme";
import { AppMediumText, AppText, Button, FormErrorMessage, Page, PasswordField, TextField } from "../../components";

export const PasswordReset = ({ navigation }) => {
    const {
        control,
        errors,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm();

    const onSubmit = (values) => {
        console.log("The values: ", values);

        navigation.navigate("PasswordResetSuccessful");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Page style={styles.page}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <AppText style={styles.pageTitle}>Set a new password</AppText>
                    </View>
                    <View style={styles.form}>
                        <FormErrorMessage label="Something happened" />

                        <AppText style={styles.description}>
                            We recommend using a mix of upper and lower case, special characters and numbers.
                        </AppText>

                        <Controller
                            name="code"
                            defaultValue=""
                            control={control}
                            rules={{ required: "Reset code is required." }}
                            render={({ onChange, onBlur, value, ref }, { invalid }) => (
                                <TextField
                                    ref={ref}
                                    value={value}
                                    error={invalid}
                                    onBlur={onBlur}
                                    keyboardType="number-pad"
                                    placeholder="Enter reset code"
                                    style={{ marginTop: RFPercentage(2) }}
                                    onChangeText={(value) => onChange(value)}
                                />
                            )}
                        />
                        {errors.code && <AppText style={styles.fieldErrorText}>{errors.code.message}</AppText>}

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
                                    autoCapitalize="none"
                                    placeholder="New password"
                                    onChangeText={(value) => onChange(value)}
                                />
                            )}
                        />

                        {errors.password && <AppText style={styles.fieldErrorText}>{errors.password.message}</AppText>}
                    </View>

                    <Button disabled={isSubmitting} label="Reset Password" onPress={handleSubmit(onSubmit)} />
                    <View style={styles.registerActionBox}>
                        <AppText>Already signed up?</AppText>
                        <AppMediumText style={styles.singupLink}>Log In</AppMediumText>
                    </View>
                </ScrollView>
            </Page>
        </SafeAreaView>
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
