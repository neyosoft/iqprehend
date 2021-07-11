import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useToast } from "react-native-fast-toast";
import { useForm, Controller } from "react-hook-form";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useAuth } from "../../context";
import { AppMediumText, AppText, AppTextField, Button } from "../../components";

import theme from "../../theme";

export const BankSettings = ({ navigation }) => {
    const toast = useToast();
    const { user, refreshUser, authenticatedRequest } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            bvn: user.bvn,
            bank: user.bank,
            accountType: user.accountType,
            dateOfBirth: user.dateOfBirth,
            accountName: user.accountName,
            accountNumber: user.accountNumber,
        },
    });

    const onSubmit = async (values) => {
        try {
            const { data } = await authenticatedRequest.put("/user/update-user-profile", { bankInformation: values });

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
                <AppMediumText style={styles.title}>Bank Information</AppMediumText>

                <View>
                    <Controller
                        control={control}
                        name="accountName"
                        rules={{ required: "Account name is required." }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <AppTextField
                                ref={ref}
                                value={value}
                                onBlur={onBlur}
                                style={styles.input}
                                onChangeText={onChange}
                                placeholder="Account Name"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="accountNumber"
                        rules={{ required: "Account number is required." }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <AppTextField
                                ref={ref}
                                value={value}
                                onBlur={onBlur}
                                style={styles.input}
                                onChangeText={onChange}
                                placeholder="Account Number"
                            />
                        )}
                    />
                    <AppTextField style={styles.input} label="Bank" />

                    <Controller
                        name="bank"
                        control={control}
                        rules={{ required: "Bank is required." }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <AppTextField
                                ref={ref}
                                value={value}
                                onBlur={onBlur}
                                style={styles.input}
                                onChangeText={onChange}
                                placeholder="Bank"
                            />
                        )}
                    />

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
    button: {
        marginTop: RFPercentage(5),
    },
});
