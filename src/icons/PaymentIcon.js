import React from "react";
import Svg, { Path } from "react-native-svg";

export const PaymentIcon = (props) => {
    return (
        <Svg width={24} height={19} viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Path
                d="M21 1.921H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2v-12a2 2 0 00-2-2zM1 7.921h22"
                stroke="#174542"
                strokeOpacity={0.65}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
