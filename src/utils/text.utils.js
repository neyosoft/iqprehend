export const capitalize = (str) => {
    if (!str) return "";

    return str
        .split(" ")
        .map((record) => record.charAt(0)?.toUpperCase() + record.slice(1)?.toLowerCase())
        .join(" ");
};
