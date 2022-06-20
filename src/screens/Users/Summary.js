import {
    View,
    Image,
    Share,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useWindowDimensions,
} from "react-native";
import { AppMediumText, AppText } from "../../components";

const wordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(" ").length;
};

export const Summary = () => {
    const handleSummaryTextSubmission = async () => {
        if (summaryText.trim().length < 1) {
            return toast.show("Kindly submit content for summary.");
        }

        const summaryMaxWordCount = settingsResponse.data?.summary?.count || 200;

        if (wordCount(summaryText) > summaryMaxWordCount) {
            return toast.show("Summary text is too long.");
        }

        try {
            setIsSubmitting(true);

            const { data } = articlesSummaryResponse.data
                ? await authenticatedRequest().put("/summary", {
                      id: articlesSummaryResponse.data._id,
                      content: summaryText,
                  })
                : await authenticatedRequest().post("/summary", {
                      article: articleID,
                      content: summaryText,
                  });

            if (data && data.data) {
                toast.show(data.data.message, { type: "success" });
                navigation.goBack();
            } else {
                throw new Error("There is a problem submitting your summary. Kindly try again");
            }
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));
            setIsSubmitting(false);
        }
    };

    const handleInvitationShare = (URL) => {
        Share.share(
            {
                uri: URL,
                message: URL,
                title: "Share with your friends and family",
            },
            { dialogTitle: "Share with your friends and family", subject: "Share with your friends and family" },
        );
    };

    return (
        <View>
            <AppText style={styles.wordCountText}>
                Summary words: {wordCount(summaryText)}/<AppMediumText>{summaryMaxWordCount}</AppMediumText>
            </AppText>

            <TextInput
                multiline={true}
                value={summaryText}
                textAlignVertical="top"
                style={styles.summaryInput}
                onChangeText={setSummaryText}
                placeholder="Enter summary here..."
            />

            <AppText style={styles.note}>
                <AppMediumText>Note:</AppMediumText> You are not eligible for any reward if you do not have active paid
                subscription
            </AppText>

            <Button
                style={styles.button}
                disabled={isSubmitting}
                onPress={handleSummaryTextSubmission}
                label={isSubmitting ? "Submitting..." : articlesSummaryResponse.data ? "Update" : "Submit"}
            />
        </View>
    );
};

const styles = StyleSheet.create({});
