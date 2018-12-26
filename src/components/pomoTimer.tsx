import React from 'react'
import { observer, inject } from 'mobx-react';
import PomoStore from '../pomoStore';
import { Pomo, PomoStatus } from '../models/pomo';
import { milliseceondToMinuteSeconds } from '../helper/timeHelper';
import { timerStatus } from '../models/pomoStatus';

@inject("store")
@observer
export default class PomoTimer extends React.Component<PomoTimerProps, PomoTimerState> {
    constructor(props: any) {
        super(props)
        this.state = {
            startTime: 0,
            pauses: [],
            currentTime: 0,
            remainingTime: this.props.store && this.props.store.config.pomoDuration || 25 * 60,
            status: timerStatus.start
        }
    }

    timer: NodeJS.Timeout | null = null

    componentDidMount() {
        this.startTimer()
    }

    startTimer = () => {
        const pomo = this.props.store && this.props.store.currentPomo
        const config = this.props.store && this.props.store.config
        if (!pomo || !config) return null;

        this.setState({ status: timerStatus.inProgress, startTime: pomo.timestamp.startTime.getTime() }, () => {
            this.timer = setInterval(() => {
                if (this.state.status !== timerStatus.paused) {
                    // add all paused times as well
                    const time = (new Date().getTime() - this.state.startTime) + this.state.pauses.reduce((a, b) => a + b, 0)
                    this.setState({
                        currentTime: time
                    })
                }
            }, 333)
        })
    }

    pauseTimer = () => {
        const newPauses = [...this.state.pauses, this.state.currentTime];
        this.setState({ status: timerStatus.paused, pauses: newPauses })
    }

    resumeTimer = () => {
        this.setState({ status: timerStatus.inProgress, startTime: new Date().getTime() })
    }

    endTimer = (nextStatus?: timerStatus) => {
        if (this.timer) {
            this.setState({ status: nextStatus || timerStatus.allDone })
            clearInterval(this.timer)
        }
    }

    renderButtons() {
        switch (this.state.status) {
            case timerStatus.paused:
                return <button onClick={() => this.resumeTimer()}>resume</button>
            case timerStatus.start:
                return <button onClick={() => this.startTimer()}>start</button>
            case timerStatus.inProgress || timerStatus.inBreak:
                return <button onClick={() => this.pauseTimer()}>pause</button>
            case timerStatus.workDone:
                return <button>start break</button>
            default:
                return <button>start next session</button>
        }
    }

    render() {
        const current = milliseceondToMinuteSeconds(this.state.currentTime)
        return <div>
            {current.minutes} : {current.seconds}
            {this.renderButtons()}
        </div>
    }
}

interface PomoTimerProps {
    store?: PomoStore
}

interface PomoTimerState {
    startTime: number,
    pauses: number[],
    currentTime: number,
    remainingTime: number,
    status: timerStatus
}