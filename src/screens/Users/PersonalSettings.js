import React from "react";
import { useForm, Controller } from "react-hook-form";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useToast } from "react-native-fast-toast";

import theme from "../../theme";
import { useAuth } from "../../context";
import { debugAxiosError } from "../../utils/request.utils";
import { AppMediumText, AppText, AppTextField, Button } from "../../components";

export const PersonalSettings = ({ navigation }) => {
    const toast = useToast();
    const { user, refreshUser, authenticatedRequest } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            lastName: user.lastName,
            firstName: user.firstName,
            phoneNumber: user.phoneNumber,
        },
    });

    const onSubmit = async (values) => {
        try {
            const { data } = await authenticatedRequest.put("/user/update-user-profile", values);

            if (data && data.data) {
                toast.show(data.data.message);
                await refreshUser();
            }
        } catch (error) {
            debugAxiosError(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>Settings</AppText>
            </View>
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainerStyle}>
                <AppMediumText style={styles.title}>Personal information</AppMediumText>

                <View style={styles.imageArea}>
                    <View>
                        <View style={styles.profileImageContainer}>
                            <Image style={styles.profileImage} source={require("../../assets/images/image1.png")} />
                        </View>
                        <TouchableOpacity style={styles.uploadIcon}>
                            <Icon name="camera-outline" color="#fff" size={RFPercentage(3.5)} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    <Controller
                        name="firstName"
                        control={control}
                        rules={{ required: "First name is required." }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <AppTextField
                                ref={ref}
                                value={value}
                                onBlur={onBlur}
                                style={styles.input}
                                onChangeText={onChange}
                                placeholder="First Name"
                            />
                        )}
                    />
                    {errors.firstName && <AppText style={styles.fieldErrorText}>{errors.firstName.message}</AppText>}

                    <Controller
                        name="lastName"
                        control={control}
                        rules={{ required: "First name is required." }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <AppTextField
                                ref={ref}
                                value={value}
                                onBlur={onBlur}
                                style={styles.input}
                                onChangeText={onChange}
                                placeholder="Last Name"
                            />
                        )}
                    />

                    {errors.lastName && <AppText style={styles.fieldErrorText}>{errors.lastName.message}</AppText>}

                    <Controller
                        control={control}
                        name="phoneNumber"
                        rules={{ required: "First name is required." }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <AppTextField
                                ref={ref}
                                value={value}
                                onBlur={onBlur}
                                style={styles.input}
                                onChangeText={onChange}
                                placeholder="Phone number"
                            />
                        )}
                    />

                    {errors.phoneNumber && (
                        <AppText style={styles.fieldErrorText}>{errors.phoneNumber.message}</AppText>
                    )}

                    <Button
                        style={styles.button}
                        disabled={isSubmitting}
                        onPress={handleSubmit(onSubmit)}
                        label={isSubmitting ? "Saving..." : "Save"}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

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
    profileImage: {
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
