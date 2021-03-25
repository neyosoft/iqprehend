export const moneyFormat = (value, decimalPlaces = 0) => {
    if (value) {
        return (
            "₦" +
            Number(value)
                .toFixed(decimalPlaces)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        );
    } else {
        return `₦ ${Number(0).toFixed(decimalPlaces)}`;
    }
};

export const moneyFormatWS = (value, decimalPlaces = 0) => {
    if (value) {
        return Number(value)
            .toFixed(decimalPlaces)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
        return Number(0).toFixed(decimalPlaces);
    }
};
