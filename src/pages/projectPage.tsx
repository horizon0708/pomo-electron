import React from "react";
import PomoStore from "../stores/pomoStore";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class ProjectPage extends React.Component<{store?: PomoStore}, {}> {

    render() {
        const { store} = this.props
        if(!store) return null
        const { ProjectManager } = store

        return <div>
            Project Page

            {this.renderProjects(store)}
        </div>
    }

    renderProjects(store: PomoStore) {
        return store.projects.map(p => {
            return <div key={p.id.toString()}>
                <b>{p.name}</b>
            </div>
        })
    }

}

// const Projects: React.SFC<{store: PomoStore}> = ({store}) =>  {
//     return 
// }