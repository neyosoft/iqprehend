import * as React from "react";
import { AppText } from "./AppText";

export default class TimerCountdown extends React.Component {
    state = {
        secondsRemaining: this.props.initialSecondsRemaining,
        timeoutId: undefined,
        previousSeconds: undefined,
    };

    componentDidMount() {
        this.tick();
    }

    componentWillReceiveProps(newProps) {
        if (this.state.timeoutId !== undefined) {
            clearTimeout(this.state.timeoutId);
        }
        this.setState({
            previousSeconds: undefined,
            secondsRemaining: newProps.initialSecondsRemaining,
        });
    }

    componentDidUpdate() {
        if (!this.state.previousSeconds && this.state.secondsRemaining > 0) {
            this.tick();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.state.timeoutId);
    }

    tick = () => {
        const currentSeconds = Date.now();
        const dt = this.state.previousSeconds ? currentSeconds - this.state.previousSeconds : 0;
        const interval = 1000;

        // correct for small variations in actual timeout time
        const intervalSecondsRemaing = interval - (dt % interval);
        let timeout = intervalSecondsRemaing;

        if (intervalSecondsRemaing < interval / 2.0) {
            timeout += interval;
        }

        const secondsRemaining = Math.max(this.state.secondsRemaining - dt, 0);
        const isComplete = !!this.state.previousSeconds && secondsRemaining <= 0;

        if (this.state.timeoutId !== undefined) {
            clearTimeout(this.state.timeoutId);
        }

        this.setState({
            timeoutId: isComplete ? undefined : setTimeout(this.tick, timeout),
            previousSeconds: currentSeconds,
            secondsRemaining,
        });

        if (isComplete) {
            if (this.props.onComplete) {
                this.props.onComplete();
            }
            return;
        }

        if (this.props.onTick !== undefined) {
            this.props.onTick(secondsRemaining);
        }
    };

    getFormattedTime = (milliseconds) => {
        if (this.props.formatSecondsRemaining !== undefined) {
            return this.props.formatSecondsRemaining(milliseconds);
        }
        const remainingSec = Math.round(milliseconds / 1000);

        const seconds = parseInt((remainingSec % 60).toString(), 10);
        const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
        const hours = parseInt((remainingSec / 3600).toString(), 10);

        const s = seconds < 10 ? "0" + seconds : seconds;
        const m = minutes < 10 ? "0" + minutes : minutes;
        let h = hours < 10 ? "0" + hours : hours;
        h = h === "00" ? "" : h + ":";
        return h + m + ":" + s;
    };

    render() {
        const secondsRemaining = this.state.secondsRemaining;
        const style = this.props.style;
        return <AppText style={style}>{this.getFormattedTime(secondsRemaining)}</AppText>;
    }

    static defaultProps = {
        formatSecondsRemaining: undefined,
        onTick: undefined,
        onComplete: undefined,
    };
}
