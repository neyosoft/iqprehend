import React from "react";
import Svg, { Path } from "react-native-svg";

export const CompletedCheckMark = (props) => {
    return (
        <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Path
                d="M40 20c0 11.045-8.955 20-20 20S0 31.045 0 20 8.955 0 20 0s20 8.955 20 20z"
                fill="#36A39B"
                fillOpacity={0.81}
            />
            <Path
                d="M30.001 9L16.399 24.616l-5.602-6.429L8 21.399l8.399 9.651 16.398-18.838L30.001 9z"
                fill="#F0FDE8"
            />
        </Svg>
    );
};
