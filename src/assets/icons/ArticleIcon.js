import React from "react";
import Svg, { Path } from "react-native-svg";

const ArticleIcon = (props) => (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            stroke="#060169"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3ZM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z"
        />
    </Svg>
);

export default ArticleIcon;
