import React from "react";
import Svg, { Path } from "react-native-svg";

const SettingsIcon = (props) => (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"
            stroke="#060169"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default SettingsIcon;
