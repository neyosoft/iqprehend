import React from "react";
import Svg, { Path } from "react-native-svg";

export const VideoFilterIcon = (props) => (
    <Svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            d="M16.517 1.667H3.483a1.817 1.817 0 0 0-1.816 1.816v13.034c0 1.003.813 1.816 1.816 1.816h13.034a1.817 1.817 0 0 0 1.816-1.816V3.483a1.817 1.817 0 0 0-1.816-1.816ZM5.833 1.667v16.666M14.167 1.667v16.666M1.667 10h16.666M1.667 5.833h4.166M1.667 14.167h4.166M14.167 14.167h4.166M14.167 5.833h4.166"
            stroke={props.color || "#060169"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default VideoFilterIcon;
