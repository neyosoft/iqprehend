import React from "react";
import Svg, { Path } from "react-native-svg";

export const LogoutIcon = (props) => {
    return (
        <Svg width={19} height={21} viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.466 6.153a.75.75 0 00-1.06 1.06L11.8 9.607H.75a.75.75 0 100 1.5H11.8l-2.394 2.395a.75.75 0 101.06 1.06l3.675-3.674a.75.75 0 000-1.06l-3.675-3.675zm2.019-4.232c.852 0 1.447.001 1.91.039.453.037.714.106.911.207.424.215.768.56.984.983.1.197.17.458.207.912.037.463.038 1.057.038 1.91v8.771c0 .853 0 1.447-.038 1.91-.038.454-.107.714-.207.912a2.25 2.25 0 01-.984.983c-.197.1-.458.17-.912.207-.462.038-1.057.039-1.91.039h-3.26c-.852 0-1.446-.001-1.909-.039-.454-.037-.714-.106-.912-.207a2.25 2.25 0 01-.983-.983c-.1-.198-.17-.458-.207-.912-.038-.463-.039-1.057-.039-1.91v-.711a.75.75 0 00-1.5 0v.744c0 .812 0 1.468.044 1.999.044.547.139 1.027.365 1.47a3.75 3.75 0 001.639 1.64c.444.226.924.32 1.471.365.53.044 1.187.044 2 .044h3.324c.813 0 1.469 0 2-.044.546-.045 1.026-.139 1.47-.365a3.75 3.75 0 001.64-1.64c.226-.443.32-.923.365-1.47.043-.531.043-1.187.043-2V5.94c0-.813 0-1.468-.043-2-.045-.546-.14-1.026-.366-1.47A3.75 3.75 0 0015.987.83c-.444-.226-.924-.32-1.47-.365-.531-.044-1.187-.044-2-.044H9.192c-.812 0-1.468 0-1.999.044-.547.044-1.027.139-1.471.365A3.75 3.75 0 004.083 2.47c-.226.444-.32.924-.365 1.47-.044.532-.044 1.187-.044 2v.744a.75.75 0 101.5 0v-.712c0-.852.001-1.446.039-1.909.037-.454.106-.715.207-.912a2.25 2.25 0 01.983-.983c.198-.101.458-.17.912-.207.463-.038 1.057-.039 1.91-.039h3.26z"
                fill="#174542"
                fillOpacity={0.65}
            />
        </Svg>
    );
};
