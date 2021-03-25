import React from "react";
import Svg, { Path } from "react-native-svg";

export const RecordIcon = (props) => {
    return (
        <Svg width={50} height={50} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Path
                d="M35.938 21.875v4.688a10.937 10.937 0 11-21.876 0v-4.688h-3.124v4.688a14.062 14.062 0 0012.5 13.968v3.219h-6.25v3.125h15.625V43.75h-6.25v-3.219a14.062 14.062 0 0012.5-13.968v-4.688h-3.126z"
                fill="#C4C4C4"
            />
            <Path
                d="M25 34.375a7.813 7.813 0 007.813-7.813V10.938a7.813 7.813 0 00-15.626 0v15.626A7.813 7.813 0 0025 34.374zm-4.688-23.438a4.688 4.688 0 019.375 0v15.626a4.688 4.688 0 01-9.375 0V10.938z"
                fill="#C4C4C4"
            />
        </Svg>
    );
};
