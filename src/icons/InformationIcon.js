import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

export const InformationIcon = (props) => {
    return (
        <Svg width={21} height={21} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Rect
                x={1.581}
                y={0.767}
                width={18.061}
                height={19.314}
                rx={2}
                fill="#FFE58A"
                stroke="#6D6D6D"
                strokeWidth={1.2}
            />
            <Path
                d="M11.403 14.196c0 .4.424.624 1.27.624v.802H8.186v-.802c.847 0 1.27-.223 1.27-.624V9.919c0-.445-.423-.668-1.27-.668v-.802h3.26v5.747h-.042zm.212-8.064c0 .312-.127.624-.339.847-.212.222-.55.356-.89.356a2.03 2.03 0 01-.507-.089.617.617 0 01-.382-.267c-.084-.134-.211-.223-.254-.401-.084-.134-.084-.312-.084-.49 0-.357.127-.624.38-.847.255-.223.551-.356.89-.356.339 0 .635.133.89.356.169.267.296.535.296.891z"
                fill="#fff"
            />
            <Path
                d="M12.886 15.889H7.973v-1.247h.212c.466 0 1.059-.09 1.059-.401V9.964c0-.357-.55-.446-1.06-.446h-.21V8.271h3.684v5.97c0 .089 0 .133.042.178.085.089.296.223 1.016.223h.212v1.247h-.042zm-4.49-.445h4.108v-.357c-.55-.044-.889-.133-1.1-.356-.128-.134-.17-.312-.17-.49V8.716H8.397v.357c.847.044 1.27.312 1.27.846v4.277c0 .535-.423.802-1.27.847v.4zm1.949-7.886c-.212 0-.381-.045-.55-.134-.17-.089-.34-.178-.467-.312-.127-.133-.254-.267-.296-.445a1.286 1.286 0 01-.127-.58c0-.4.17-.757.423-1.024a1.475 1.475 0 011.017-.4c.38 0 .72.133 1.016.4.296.267.424.624.424 1.025 0 .4-.127.713-.424 1.024-.254.312-.593.446-1.016.446zm0-2.406c-.297 0-.55.09-.763.267-.211.179-.296.401-.296.669 0 .133.042.267.085.356a.8.8 0 00.211.312c.085.09.212.178.34.223.126.044.253.089.423.089.296 0 .55-.09.72-.312.211-.178.296-.4.296-.668s-.085-.49-.296-.669c-.17-.178-.424-.267-.72-.267z"
                fill="#6D6D6D"
            />
        </Svg>
    );
};
