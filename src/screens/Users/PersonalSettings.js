import React from "react";
import { Formik } from "formik";
import { object, string, mixed } from "yup";
import { useToast } from "react-native-fast-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { launchImageLibrary } from "react-native-image-picker";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { extractResponseErrorMessage } from "../../utils/request.utils";
import { AppMediumText, AppText, AppTextField, Button } from "../../components";

export const PersonalSettings = ({ navigation }) => {
    const toast = useToast();
    const { user, refreshUser, authenticatedRequest } = useAuth();

    const onSubmit = async (values) => {
        const formData = new FormData();

        formData.append("lastName", values.lastName);
        formData.append("firstName", values.firstName);
        formData.append("phoneNumber", values.phoneNumber);

        if (values.profilePicture && typeof values.profilePicture !== "string") {
            formData.append("profilePicture", values.profilePicture);
        }

        try {
            const { data } = await authenticatedRequest().put("/user/update-user-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (data && data.data) {
                toast.show(data.data.message);
                await refreshUser();
            }
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));
        }
    };

    const handleImageSelection = (setFieldValue) => {
        launchImageLibrary({ mediaType: "photo", maxWidth: 400, includeBase64: false }, (response) => {
            if (response.assets && Array.isArray(response.assets) && response.assets.length === 1) {
                const selelctedAssets = response.assets[0];

                setFieldValue("profilePicture", {
                    uri: selelctedAssets.uri,
                    name: selelctedAssets.fileName,
                    type: selelctedAssets.type,
                });
            }
        });
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>Settings</AppText>
                </View>
                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainerStyle}>
                    <Formik
                        onSubmit={onSubmit}
                        validationSchema={personalInformationSchema}
                        initialValues={{
                            lastName: user.lastName,
                            firstName: user.firstName,
                            phoneNumber: user.phoneNumber,
                            profilePicture: user.profilePicture || null,
                        }}>
                        {({ handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting, errors, values }) => (
                            <View>
                                <AppMediumText style={styles.title}>Personal information</AppMediumText>

                                <View style={styles.imageArea}>
                                    <View>
                                        <View style={styles.profileImageContainer}>
                                            <Image
                                                style={styles.profilePicture}
                                                source={
                                                    values?.profilePicture
                                                        ? typeof values.profilePicture === "string"
                                                            ? { uri: values.profilePicture }
                                                            : { uri: values.profilePicture.uri }
                                                        : require("../../assets/images/avatar.jpg")
                                                }
                                            />
                                        </View>
                                        <TouchableOpacity
                                            style={styles.uploadIcon}
                                            onPress={() => handleImageSelection(setFieldValue)}>
                                            <Icon name="camera-outline" color="#fff" size={RFPercentage(3.5)} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <AppTextField
                                    label="First Name"
                                    style={styles.input}
                                    value={values.firstName}
                                    placeholder="First Name"
                                    onBlur={handleBlur("firstName")}
                                    onChangeText={handleChange("firstName")}
                                />
                                {errors.firstName && (
                                    <AppText style={styles.fieldErrorText}>{errors.firstName}</AppText>
                                )}

                                <AppTextField
                                    label="Last Name"
                                    style={styles.input}
                                    placeholder="Last Name"
                                    value={values.lastName}
                                    onBlur={handleBlur("lastName")}
                                    onChangeText={handleChange("lastName")}
                                />

                                {errors.lastName && <AppText style={styles.fieldErrorText}>{errors.lastName}</AppText>}

                                <AppTextField
                                    style={styles.input}
                                    label="Phone number"
                                    keyboardType="numeric"
                                    placeholder="Phone number"
                                    value={values.phoneNumber}
                                    onBlur={handleBlur("phoneNumber")}
                                    onChangeText={handleChange("phoneNumber")}
                                />

                                {errors.phoneNumber && (
                                    <AppText style={styles.fieldErrorText}>{errors.phoneNumber}</AppText>
                                )}

                                <Button
                                    style={styles.button}
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                    label={isSubmitting ? "Saving..." : "Save"}
                                />
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const personalInformationSchema = object().shape({
    profileImage: mixed(),
    lastName: string()
        .required("Last name is required.")
        .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field "),
    firstName: string()
        .required("First name is required.")
        .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field "),
    phoneNumber: string()
        .required("Phone number is required.")
        .matches(/^[0-9]+$/, "Only digits are allowed for this field ")
        .length(11, "Invalid Phone number. Phone number must be 11 Characters"),
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
    imageArea: {
        alignItems: "center",
        marginVertical: RFPercentage(2),
    },
    profileImageContainer: {
        overflow: "hidden",
        width: RFPercentage(20),
        height: RFPercentage(20),
        borderRadius: RFPercentage(10),
    },
    profilePicture: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    uploadIcon: {
        position: "absolute",
        bottom: RFPercentage(3),
        padding: RFPercentage(1.3),
        borderRadius: RFPercentage(20),
        backgroundColor: theme.colors.primary,
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
