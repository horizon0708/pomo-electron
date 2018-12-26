import React from 'react'
// import { PomoConsumer } from '../App';
import { observer, inject } from 'mobx-react'
import PomoStore from '../pomoStore';
import PomoTimer from '../components/pomoTimer';

@inject("store")
@observer
export default class MainPage extends React.Component<{store?: PomoStore}, {}> {

    render() {
        const store = this.props.store

         return <div>
                Pomo count: {store && store.allPomosCount}
                <button onClick={() => store && store.addPomo()}> add Pomo </button>
                <PomoTimer />
            </div>
    }
}
