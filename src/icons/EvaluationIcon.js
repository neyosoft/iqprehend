import React from "react";
import Svg, { Path } from "react-native-svg";

export const EvaluationIcon = (props) => {
    return (
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M.374.523A.75.75 0 011.122.52L4.25 2.308 7.378.52a.75.75 0 01.744 0l3.128 1.788L14.378.52a.75.75 0 011.122.651v8.25h3.25a.75.75 0 01.75.75v7a2.75 2.75 0 01-2.75 2.75H5.518c-.813 0-1.469 0-2-.043-.546-.045-1.026-.139-1.47-.365a3.75 3.75 0 01-1.64-1.64c-.226-.443-.32-.924-.365-1.47C0 15.872 0 15.216 0 14.403V1.171A.75.75 0 01.374.523zM16.75 18.42c.69 0 1.25-.56 1.25-1.25v-6.25h-2.5v6.25c0 .69.56 1.25 1.25 1.25zm-2.45 0H5.55c-.852 0-1.447 0-1.91-.038-.453-.037-.714-.106-.911-.207a2.25 2.25 0 01-.984-.983c-.1-.198-.17-.458-.207-.912-.037-.463-.038-1.057-.038-1.91V2.464l2.378 1.359a.75.75 0 00.744 0L7.75 2.035l3.128 1.788a.75.75 0 00.744 0L14 2.463v14.708c0 .45.108.875.3 1.25zM4 7.171a.75.75 0 01.75-.75h4a.75.75 0 110 1.5h-4a.75.75 0 01-.75-.75zm3.75 3.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zM7 15.171a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm-1.25-4a1 1 0 11-2 0 1 1 0 012 0zm-1 5a1 1 0 100-2 1 1 0 000 2z"
                fill="#174542"
                fillOpacity={0.65}
            />
        </Svg>
    );
};
