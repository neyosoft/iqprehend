import React from "react";
import Svg, { Path } from "react-native-svg";

export const VideoArticleIcon = (props) => {
    return (
        <Svg width={55} height={36} viewBox="0 0 55 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Path
                d="M54.447 7.765s-.537-3.527-2.188-5.081C50.168.646 47.822.638 46.75.515 39.053 0 27.509 0 27.509 0h-.027S15.938 0 8.242.515c-1.073.123-3.419.131-5.51 2.169C1.081 4.238.545 7.764.545 7.764S0 11.905 0 16.054v3.886c0 4.14.554 8.28.554 8.28s.535 3.526 2.187 5.081c2.091 2.037 4.841 1.972 6.063 2.184C13.197 35.877 27.5 36 27.5 36s11.553-.016 19.25-.532c1.072-.123 3.418-.13 5.509-2.168 1.651-1.554 2.188-5.08 2.188-5.08S55 24.08 55 19.94v-3.887c0-4.149-.553-8.288-.553-8.288z"
                fill="#CF2A2A"
            />
            <Path d="M21.825 10.252v14.384l14.857-7.167-14.858-7.217z" fill="#EAEAEA" />
        </Svg>
    );
};
