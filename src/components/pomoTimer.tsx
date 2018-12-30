import React from 'react'
import { observer, inject } from 'mobx-react';
import PomoStore from '../stores/pomoStore';
import { PomoStatus } from '../models/pomo';
import { milliseceondToMinuteSeconds } from '../helper/timeHelper';
import { PomoManager } from '../helper/pomoManager';

@inject("store")
@observer
export default class PomoTimer extends React.Component<PomoTimerProps, {}> {
    constructor(props: any) {
        super(props)
    }

    timer: NodeJS.Timeout | null = null
    renderButtons() {
        if (!this.props.store) {
            return this.renderNoStoreError()
        }
        // const { pomoManager: { currentPomo: { status } } } = this.props.store
        const { pomoManager } = this.props.store
        const { currentPomo } = pomoManager
        const { status } = currentPomo
        switch (status) {
            case PomoStatus.inPause:
                return <button onClick={() => pomoManager.to(PomoStatus.inProgress)}>resume</button>
            case PomoStatus.start:
                return <button onClick={() => pomoManager.to(PomoStatus.inProgress)}>start</button>
            case PomoStatus.inProgress || PomoStatus.inBreak:
                return <button onClick={() => pomoManager.to(PomoStatus.inPause)}>pause</button>
            case PomoStatus.allDone:
                return <button onClick={()=> pomoManager.nextPomo()}>start next session</button>
            default:
                return null
        }
    }

    renderNoStoreError() {
        return <div>
            store is not injected
        </div>
    }

    renderBreakButton() {
        if (!this.props.store) {
            return this.renderNoStoreError()
        }
        const { pomoManager } = this.props.store
        if(pomoManager.currentPomo.status !== PomoStatus.inProgress) {
            return null
        }
        return <button onClick={()=>pomoManager.to(PomoStatus.inBreak)}>go to break!</button>
    }

    render() {
        if (!this.props.store) {
            return this.renderNoStoreError()
        }
        const { pomoManager: {currentPomo } } = this.props.store
        const { pomoManager } = this.props.store
        const { currentTime} = currentPomo
        const current = milliseceondToMinuteSeconds(currentTime)
        return <div>
            status: {pomoManager.currentPomo.status}
            {current.minutes} : {current.seconds}
            {this.renderButtons()}
            {this.renderBreakButton()}
            {pomoManager.isOvertime ? "overtime" : null}
            <div>
                {currentPomo.currentTime}
            </div>
            <button onClick={()=>pomoManager.resetCurrentPomo()}>reset currentPomo</button>
        </div>
    }

}

interface PomoTimerProps {
    store?: PomoStore
}

