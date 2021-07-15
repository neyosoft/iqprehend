import React from "react";
import { Formik } from "formik";
import { object, string, ref } from "yup";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useToast } from "react-native-fast-toast";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AppMediumText, AppText, AppTextField, Button } from "../../components";

import theme from "../../theme";
import { extractResponseErrorMessage } from "../../utils/request.utils";
import { useAuth } from "../../context";

export const ChangePassword = ({ navigation }) => {
    const toast = useToast();
    const { authenticatedRequest } = useAuth();

    const onSubmit = async (values, { resetForm }) => {
        const formData = new FormData();

        formData.append("password", values.password);

        try {
            const { data } = await authenticatedRequest().put("/user/update-user-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (data && data.data) {
                resetForm({ values: { password: "", confirmPassword: "" } });
                toast.show("Password successfully changed.");
            }
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));
        }
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <Formik
                onSubmit={onSubmit}
                validateOnChange={false}
                validationSchema={changePasswordSchema}
                initialValues={{ password: "", confirmPassword: "" }}>
                {({ handleChange, handleBlur, handleSubmit, isSubmitting, errors, values }) => (
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={navigation.goBack}>
                                <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                            </TouchableOpacity>
                            <AppText style={styles.headerTitle}>Settings</AppText>
                        </View>
                        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainerStyle}>
                            <AppMediumText style={styles.title}>Change Password</AppMediumText>

                            <View style={{ marginTop: RFPercentage(2) }}>
                                <AppTextField
                                    style={styles.input}
                                    label="New Password"
                                    value={values.password}
                                    error={!!errors.password}
                                    onBlur={handleBlur("password")}
                                    onChangeText={handleChange("password")}
                                />
                                {errors.password && <AppText style={styles.fieldErrorText}>{errors.password}</AppText>}

                                <AppTextField
                                    style={styles.input}
                                    label="Confirm Password"
                                    error={!!errors.password}
                                    value={values.confirmPassword}
                                    onBlur={handleBlur("confirmPassword")}
                                    onChangeText={handleChange("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <AppText style={styles.fieldErrorText}>{errors.confirmPassword}</AppText>
                                )}

                                <Button
                                    style={styles.button}
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                    label={isSubmitting ? "Processing..." : "Change Password"}
                                />
                            </View>
                        </ScrollView>
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
};

const changePasswordSchema = object().shape({
    password: string().required("Password is required.").min(6),
    confirmPassword: string()
        .required("Password confirmation is required.")
        .oneOf([ref("password"), null], "Passwords must match"),
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: RFPercentage(2),
        backgroundColor: theme.colors.primary,
    },
    headerTitle: {
        flex: 1,
        color: "#fff",
        fontSize: RFPercentage(2.4),
        marginHorizontal: RFPercentage(2),
    },
    content: {
        flex: 1,
    },
    contentContainerStyle: {
        padding: RFPercentage(3),
    },
    title: {
        fontSize: RFPercentage(2.5),
    },
    input: {
        marginTop: RFPercentage(2),
    },
    button: {
        marginTop: RFPercentage(5),
    },
    fieldErrorText: {
        marginTop: 3,
        color: "#FF7878",
        fontSize: RFPercentage(1.8),
    },
});
