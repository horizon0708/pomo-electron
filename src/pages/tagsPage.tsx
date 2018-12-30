import { observer, inject } from "mobx-react";
import React from "react";
import PomoStore from "../stores/pomoStore";
import Tag from "../models/tag";



interface State { tag: string, category: string }
type fieldInput = keyof State
@inject('store')
@observer
export default class TagsPage extends React.Component<{ store?: PomoStore }, State> {
    state = {
        tag: "",
        category: ""
    }

    render() {
        const { store } = this.props
        if (!store) return null
        const { tagManager } = store


        return <div>
            <div>
                <div>
                    {/* {this.renderInput("tag")} */}
                    <input value={tagManager.editingTag.name} onChange={tagManager.handleTagEdit} type="text"/>
                    <button onClick={()=>tagManager.testAddTag(this.state.tag)}>Add Tag</button>
                </div>
                <div>
                    {this.renderInput("category")}
                    <button onClick={()=>tagManager.addCategory(this.state.category)}>Add Category</button>
                </div>
            </div>
            ----------------------
            <div>
                Tags:
                {this.renderTags(tagManager.allTags)}
            </div>
            <div>
                Categories:
                {this.renderTags(tagManager.allCategories)}
            </div>
            -----------------------
        </div>
    }

    renderInput(name: fieldInput) {
        return <input value={this.state[name]} onChange={e => this.handleStateInput(e, name)} type="text" />
    }

    renderForm(name: fieldInput) {
    }

    handleStateInput(e: React.SyntheticEvent, fieldName: fieldInput) {
        const target = e.target as HTMLInputElement
        this.setState(prevState => ({
            ...prevState,
            [fieldName]: target.value
        }))
    }

    renderTags(tags: Tag[]) {
        return tags.map(x => {
            return <div key={x.id.toString()}>
                {x.name}
            </div>
        })
    }
}