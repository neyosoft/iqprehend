import React from "react";
import Svg, { Path } from "react-native-svg";

export const TextFilterIcon = (props) => (
    <Svg width={14} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            d="M13.471 4.862 9.138.529a.666.666 0 0 0-.471-.196h-7C.93.333.333.93.333 1.667v14.666c0 .737.597 1.334 1.334 1.334h10.666c.737 0 1.334-.597 1.334-1.334v-11a.666.666 0 0 0-.196-.471ZM9 13H3.667a.667.667 0 0 1 0-1.333H9A.667.667 0 0 1 9 13Zm1.333-2.667H3.667a.667.667 0 0 1 0-1.333h6.666a.667.667 0 0 1 0 1.333ZM9 5.667A.667.667 0 0 1 8.333 5V1.603l4.064 4.064H9Z"
            fill={props.color}
        />
    </Svg>
);
