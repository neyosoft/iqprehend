import * as React from "react";
import { AppText } from "./AppText";

const NewTimerCountdown = ({ style, initialSecondsRemaining = 0, onComplete }) => {
    const timeoutRef = React.useRef();
    const [timeLeft, setTimeLeft] = React.useState(initialSecondsRemaining < 0 ? 0 : initialSecondsRemaining);

    React.useEffect(() => {
        timeoutRef.current = setInterval(() => {
            const isComplete = timeLeft <= 0;

            if (isComplete) {
                clearInterval(timeoutRef.current);
                return onComplete();
            }

            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => {
            if (timeoutRef.current) {
                clearInterval(timeoutRef.current);
            }
        };
    }, [onComplete, timeLeft]);

    const getFormattedTime = (remainingSec) => {
        const seconds = parseInt((remainingSec % 60).toString(), 10);
        const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
        const hours = parseInt((remainingSec / 3600).toString(), 10);

        const s = seconds < 10 ? "0" + seconds : seconds;
        const m = minutes < 10 ? "0" + minutes : minutes;
        let h = hours < 10 ? "0" + hours : hours;
        h = h === "00" ? "" : h + ":";
        return h + m + ":" + s;
    };

    return <AppText style={style}>{getFormattedTime(timeLeft)}</AppText>;
};

export default React.memo(NewTimerCountdown);
