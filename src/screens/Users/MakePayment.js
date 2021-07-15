import React from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { useQuery } from "react-query";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useToast } from "react-native-fast-toast";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AppMediumText, AppText, AppTextField, Button, PageLoading } from "../../components";

import theme from "../../theme";
import { useAuth } from "../../context";
import { moneyFormat } from "../../utils/money.utils";
import { extractResponseErrorMessage } from "../../utils/request.utils";

export const MakePayment = ({ navigation, route }) => {
    const toast = useToast();
    const { authenticatedRequest } = useAuth();

    const { plan } = route.params;

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

    const paymentResponse = useQuery("payment-info", async () => {
        const { data } = await authenticatedRequest().post("/payment", { plan: plan.id, amount: plan.price });

        if (data && data) {
            return data.data;
        } else {
            throw new Error("There is problem setting up payment at the moment.");
        }
    });

    const renderContent = () => {
        if (paymentResponse.isLoading) {
            return <PageLoading />;
        }

        if (paymentResponse.isError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                    <Icon name="alert" color="red" size={RFPercentage(10)} />
                    <AppText style={{ width: "70%", alignSelf: "center", textAlign: "center", marginTop: 20 }}>
                        There is problem setting up payment at the moment.
                    </AppText>

                    <Button label="Retry" style={{ marginTop: RFPercentage(5) }} onPress={paymentResponse.refetch} />
                </View>
            );
        }

        const paymentInfo = paymentResponse.data;

        console.log("paymentInfo: ", paymentInfo);

        return (
            <Formik
                onSubmit={onSubmit}
                validateOnChange={false}
                validationSchema={paymentSchema}
                initialValues={{ password: "", confirmPassword: "" }}>
                {({ handleChange, handleBlur, handleSubmit, isSubmitting, errors, values }) => (
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={navigation.goBack}>
                                <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                            </TouchableOpacity>
                            <AppText style={styles.headerTitle}>Payment</AppText>
                        </View>
                        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainerStyle}>
                            <AppMediumText style={styles.title}>Subscription</AppMediumText>

                            <View style={{ marginTop: RFPercentage(2) }}>
                                <AppTextField
                                    style={styles.input}
                                    label="Card Number"
                                    value={values.cardNumber}
                                    error={!!errors.cardNumber}
                                    onBlur={handleBlur("cardNumber")}
                                    onChangeText={handleChange("cardNumber")}
                                />
                                {errors.cardNumber && (
                                    <AppText style={styles.fieldErrorText}>{errors.cardNumber}</AppText>
                                )}

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginTop: RFPercentage(2),
                                    }}>
                                    <View style={{ width: "48%" }}>
                                        <AppTextField
                                            label="Exiry date"
                                            placeholder="02/24"
                                            value={values.expiryMonth}
                                            error={!!errors.expiryMonth}
                                            onBlur={handleBlur("expiryMonth")}
                                            onChangeText={handleChange("expiryMonth")}
                                        />
                                        {errors.firstName && (
                                            <AppText style={styles.fieldErrorText}>{errors.firstName}</AppText>
                                        )}
                                    </View>

                                    <View style={{ width: "48%" }}>
                                        <AppTextField
                                            label="CVV"
                                            value={values.cvv}
                                            error={!!errors.cvv}
                                            onBlur={handleBlur("cvv")}
                                            onChangeText={handleChange("cvv")}
                                        />
                                        {errors.cvv && <AppText style={styles.fieldErrorText}>{errors.cvv}</AppText>}
                                    </View>
                                </View>

                                <AppTextField
                                    label="Expiry date"
                                    style={styles.input}
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
                                    label={isSubmitting ? "Processing..." : `MAKE PAYMENT ${moneyFormat(plan.price)}`}
                                />
                            </View>
                        </ScrollView>
                    </View>
                )}
            </Formik>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            {renderContent()}
        </SafeAreaView>
    );
};

const paymentSchema = object().shape({
    cardNumber: string().required("Card number is required."),
    expiryMonth: string().required("Month is required."),
    expiryYear: string().required("Year is required."),
    cvv: string().required("CVV is required."),
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
