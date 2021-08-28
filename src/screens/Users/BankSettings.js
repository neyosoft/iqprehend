import React from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { useQuery } from "react-query";
import { useToast } from "react-native-fast-toast";
import RNPickerSelect from "react-native-picker-select";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import theme from "../../theme";
import { useAuth } from "../../context";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppMediumText, AppText, AppTextField, Button } from "../../components";
import { extractResponseErrorAsObject } from "../../utils/request.utils";

export const BankSettings = ({ navigation }) => {
    const toast = useToast();
    const { user, refreshUser, authenticatedRequest } = useAuth();

    const bankInformation = user.bankInformation || {};

    const bankResponse = useQuery("banks", async () => {
        try {
            const { data } = await authenticatedRequest().get("/bank");

            if (data && data.data) {
                return data.data.banks;
            } else {
                throw new Error("There is problem retrieving banks.");
            }
        } catch (error) {
            throw new Error("There is problem retrieving banks.");
        }
    });

    const onSubmit = async (values, { setErrors }) => {
        const formData = new FormData();

        formData.append("bankInformation", JSON.stringify(values));

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
            setErrors(extractResponseErrorAsObject(error));
        }
    };

    console.log("bankInformation: ", bankInformation);

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>Settings</AppText>
                </View>
                <Formik
                    onSubmit={onSubmit}
                    validationSchema={accountSchema}
                    initialValues={{
                        BVN: bankInformation.BVN,
                        bank: bankInformation?.bank?._id,
                        accountType: bankInformation.accountType,
                        accountName: bankInformation.accountName,
                        accountNumber: bankInformation.accountNumber,
                    }}>
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting, errors, values }) => (
                        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainerStyle}>
                            <AppMediumText style={styles.title}>Bank Information</AppMediumText>

                            <AppText style={{ fontSize: RFPercentage(2), marginBottom: 5 }}>Bank name</AppText>

                            <RNPickerSelect
                                value={values.bank}
                                useNativeAndroidPickerStyle={false}
                                placeholder={{ label: "Select Bank", value: "" }}
                                onValueChange={(value) => setFieldValue("bank", value)}
                                Icon={() => <Icon name="chevron-down" size={24} color="#000" />}
                                items={
                                    bankResponse.isSuccess
                                        ? bankResponse.data.map((record) => ({
                                              key: "_id",
                                              label: record.name,
                                              value: record._id,
                                          }))
                                        : []
                                }
                                style={{
                                    inputIOS: styles.dropdownInput,
                                    inputAndroid: styles.dropdownInput,
                                    iconContainer: { top: 14, right: 12 },
                                }}
                            />
                            {errors.bank && <AppText style={styles.fieldErrorText}>{errors.bank}</AppText>}

                            <View>
                                <AppTextField
                                    label="Account name"
                                    style={styles.input}
                                    value={values.accountName}
                                    onBlur={handleBlur("accountName")}
                                    onChangeText={handleChange("accountName")}
                                />

                                {errors.accountName && (
                                    <AppText style={styles.fieldErrorText}>{errors.accountName}</AppText>
                                )}

                                <AppTextField
                                    label="Account number"
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={values.accountNumber}
                                    onBlur={handleBlur("accountNumber")}
                                    onChangeText={handleChange("accountNumber")}
                                />
                                {errors.accountNumber && (
                                    <AppText style={styles.fieldErrorText}>{errors.accountNumber}</AppText>
                                )}

                                <AppTextField
                                    label="BVN"
                                    value={values.BVN}
                                    style={styles.input}
                                    keyboardType="numeric"
                                    onBlur={handleBlur("BVN")}
                                    onChangeText={handleChange("BVN")}
                                />
                                {errors.BVN && <AppText style={styles.fieldErrorText}>{errors.BVN}</AppText>}

                                <AppText
                                    style={{ fontSize: RFPercentage(2), marginBottom: 5, marginTop: RFPercentage(3) }}>
                                    Account type
                                </AppText>

                                <RNPickerSelect
                                    value={values.accountType}
                                    useNativeAndroidPickerStyle={false}
                                    placeholder={{ label: "Select Account Type", value: "" }}
                                    onValueChange={(value) => setFieldValue("accountType", value)}
                                    Icon={() => <Icon name="chevron-down" size={24} color="#000" />}
                                    items={[
                                        { label: "SAVINGS", value: "SAVINGS" },
                                        { label: "CURRENT", value: "CURRENT" },
                                    ]}
                                    style={{
                                        inputIOS: styles.dropdownInput,
                                        inputAndroid: styles.dropdownInput,
                                        iconContainer: { top: 14, right: 12 },
                                    }}
                                />
                                {errors.accountType && (
                                    <AppText style={styles.fieldErrorText}>{errors.accountType}</AppText>
                                )}

                                <Button
                                    style={styles.button}
                                    disabled={isSubmitting}
                                    onPress={handleSubmit}
                                    label={isSubmitting ? "Saving..." : "Save"}
                                />
                            </View>
                        </ScrollView>
                    )}
                </Formik>
            </View>
        </SafeAreaView>
    );
};

const accountSchema = object().shape({
    bank: string().required("Bank is required."),
    accountName: string().required("Account name is required."),
    accountNumber: string().required("Account number is required.").length(10),
    accountType: string().required("Account type is required."),
    BVN: string().required("BVN is required.").length(11),
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
    dropdownInput: {
        fontSize: 15,
        borderRadius: 8,
        borderWidth: 1,
        paddingRight: 40,
        color: "#000",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: "#CACACA",
    },
    title: {
        fontSize: RFPercentage(2.5),
        marginBottom: RFPercentage(3),
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
