import React, { SyntheticEvent, FormEvent } from "react";
import PomoStore from "../stores/pomoStore";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class ProjectPage extends React.Component<{ store?: PomoStore }, { name: string }> {
    state = {
        name: ""
    }

    render() {
        const { store } = this.props
        if (!store) return null
        const { projectManager } = store


        return <div>
            Project Page
            <div>
                ___
            </div>
            <div>
                {this.renderAddProject()}
                <button onClick={()=>projectManager.addNew(this.state.name)}>add</button>
            </div>
            {this.renderProjects(store)}
        </div>
    }

    renderProjects(store: PomoStore) {
        return store.projectManager.allProjects.map(p => {
            return <div key={p.id.toString()} style={{margin: "2rem"}}>
                <b>{p.name}</b>
                <p>{p.id.toString()}</p>
                <p>{p.status}</p>
                <p>{p.color}</p>

            </div>
        })
    }

    renderAddProject() {
        return <div>
            <input onChange={this.handleTextInput} value={this.state.name} type="text" />
        </div>
    }

    handleTextInput = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        this.setState({
            name: target.value
        })
    }

}

// const Projects: React.SFC<{store: PomoStore}> = ({store}) =>  {
//     return 
// }