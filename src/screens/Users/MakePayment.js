import React, { useState } from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import RNPaystack from "react-native-paystack";
import { useToast } from "react-native-fast-toast";
import { useQuery, useQueryClient } from "react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import { capitalize } from "../../utils/text.utils";
import { AppMediumText, AppText, AppTextField, Button, PageLoading } from "../../components";

import theme from "../../theme";
import { useAuth } from "../../context";
import { moneyFormat } from "../../utils/money.utils";

export const MakePayment = ({ navigation, route }) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const { authenticatedRequest } = useAuth();

    const { plan } = route.params;

    const [accessCode, setAccessCode] = useState("");

    const onSubmit = async (values) => {
        const [expiryMonth, expiryYear] = values.expiryDate.split("/");

        try {
            const paymentResponse = await RNPaystack.chargeCardWithAccessCode({
                accessCode,
                expiryYear,
                expiryMonth,
                cvc: values.cvc,
                cardNumber: values.cardNumber,
            });

            if (paymentResponse && paymentResponse.reference) {
                queryClient.invalidateQueries("payment");

                toast.show("Payment successfully completed.");

                navigation.navigate("Payment");
            }
        } catch (error) {
            toast.show("Payment failed: ", error);
        }
    };

    const paymentResponse = useQuery("payment-info", async () => {
        const { data } = await authenticatedRequest().post("/payment", { name: plan?.name?.toUpperCase() });

        if (data && data) {
            setAccessCode(data.data.accessCode);

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

        return (
            <Formik
                onSubmit={onSubmit}
                validateOnChange={false}
                validationSchema={paymentSchema}
                initialValues={{ cardName: "", cardNumber: "", cvc: "", expiryDate: "" }}>
                {({ handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue, errors, values }) => (
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={navigation.goBack}>
                                <Icon name="arrow-left" color="#fff" size={RFPercentage(3.5)} />
                            </TouchableOpacity>
                            <AppText style={styles.headerTitle}>Payment</AppText>
                        </View>
                        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainerStyle}>
                            <AppMediumText style={styles.title}>{capitalize(plan.name)} Subscription</AppMediumText>

                            <View style={{ marginTop: RFPercentage(2) }}>
                                <AppTextField
                                    label="Card Name"
                                    style={styles.input}
                                    value={values.cardName}
                                    error={!!errors.cardName}
                                    onBlur={handleBlur("cardName")}
                                    onChangeText={handleChange("cardName")}
                                />
                                {errors.cardName && <AppText style={styles.fieldErrorText}>{errors.cardName}</AppText>}

                                <AppTextField
                                    style={styles.input}
                                    label="Card Number"
                                    keyboardType="number-pad"
                                    value={values.cardNumber}
                                    error={!!errors.cardNumber}
                                    onBlur={handleBlur("cardNumber")}
                                    onChangeText={handleChange("cardNumber")}
                                />
                                {errors.cardNumber && (
                                    <AppText style={styles.fieldErrorText}>{errors.cardNumber}</AppText>
                                )}

                                <View style={styles.expiryRow}>
                                    <View style={{ width: "48%" }}>
                                        <AppTextField
                                            maxLength={5}
                                            label="Exiry date"
                                            placeholder="02/24"
                                            keyboardType="number-pad"
                                            value={values.expiryDate}
                                            error={!!errors.expiryDate}
                                            onBlur={handleBlur("expiryDate")}
                                            onChangeText={(expiryDate) => {
                                                if (expiryDate.length === 2 && values.expiryDate.length !== 3) {
                                                    setFieldValue("expiryDate", `${expiryDate}/`);
                                                } else {
                                                    setFieldValue("expiryDate", expiryDate);
                                                }
                                            }}
                                        />
                                        {errors.expiryDate && (
                                            <AppText style={styles.fieldErrorText}>{errors.expiryDate}</AppText>
                                        )}
                                    </View>

                                    <View style={{ width: "48%" }}>
                                        <AppTextField
                                            label="CVV"
                                            maxLength={3}
                                            value={values.cvc}
                                            error={!!errors.cvc}
                                            onBlur={handleBlur("cvc")}
                                            keyboardType="number-pad"
                                            onChangeText={handleChange("cvc")}
                                        />
                                        {errors.cvc && <AppText style={styles.fieldErrorText}>{errors.cvc}</AppText>}
                                    </View>
                                </View>

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
        <SafeAreaView edges={["top"]} style={styles.root}>
            {renderContent()}
        </SafeAreaView>
    );
};

const paymentSchema = object().shape({
    cvc: string().required("CVV is required.").length(3),
    cardNumber: string().required("Card number is required."),
    expiryDate: string().required("Month is required.").length(5, "Invalid expiry date"),
});

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
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
    expiryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: RFPercentage(2),
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
