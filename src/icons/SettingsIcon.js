import React from "react";
import Svg, { Path } from "react-native-svg";

export const SettingsIcon = (props) => {
    return (
        <Svg width={21} height={19} viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 4.671a3.75 3.75 0 017.425-.75h3.325a.75.75 0 010 1.5h-3.325A3.751 3.751 0 019 4.671zm3.75-2.25a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zm-12 1.5a.75.75 0 100 1.5h6a.75.75 0 000-1.5h-6zm0 10a.75.75 0 000 1.5h3.325a3.751 3.751 0 007.425-.75 3.75 3.75 0 00-7.425-.75H.75zm4.75.75a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zm8.25-.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z"
                fill="#174542"
                fillOpacity={0.65}
            />
        </Svg>
    );
};
