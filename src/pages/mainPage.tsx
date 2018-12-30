import React from 'react'
import { observer, inject } from 'mobx-react'
import PomoStore from '../stores/pomoStore';

@inject("store")
@observer
export default class MainPage extends React.Component<{store?: PomoStore}, {}> {

    render() {
        const store = this.props.store
         return <div>
                Pomo count: {store && store.allPomosCount}
            </div>
    }
}
