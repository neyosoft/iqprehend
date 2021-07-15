import { useFocusEffect } from "@react-navigation/native";

export const useRefetchOnFocus = (refetch) => {
    useFocusEffect(() => {
        refetch();
    });
    /* Maybe subscribe to App state here too */
};
