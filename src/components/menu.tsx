import React from "react";
import { inject, observer } from "mobx-react";
import AppStateStore from "../stores/appStateStore";
import { PomoPage } from "./router";

@inject("appState")
@observer
export default class Menu extends React.Component<{appState?: AppStateStore},{}>{
    
    render() {
        const {appState} = this.props
        if(!appState) {
            console.error("ERROR: App State Not Loaded")
            return null
        }

        return <div>
            <button onClick={()=>appState.to(PomoPage.project)}>Project</button>
            <button onClick={()=>appState.to(PomoPage.options)}>Options</button>
        </div>
    }
} 