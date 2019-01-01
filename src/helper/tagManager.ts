import { observable } from "mobx";
import Tag from "../models/tag";
import TagRepository from "../repositories/tagRepository";
import SubmitHelper from "./submitHelper";

export default class TagManager {
    @observable allTags: Tag[] = []
    @observable allCategories: Tag[] = []

    @observable editingTag: Tag = new Tag("")
    tagEditor: SubmitHelper<Tag> = new SubmitHelper<Tag>() //tagSubmit

    @observable editingCategory: Tag = new Tag("")
    tagRepo: TagRepository

    constructor(tagRepo: TagRepository) {
        this.tagRepo = tagRepo

        this.startAllTagsSubscription()
        this.startAllCategoriesSubscription()
    }

    async startAllTagsSubscription() {
        const sub = await this.tagRepo.getAllTags()
        sub.subscribe(res => {
            const json = res.map(r=> r.toJSON())
            console.log(json)
            this.allTags = json.map(x=>this.tagRepo.builder.buildFromSchema(x))
        })
    }

    async startAllCategoriesSubscription() {
        const sub = await this.tagRepo.getAllCategories()
        sub.subscribe(res => {
            const json = res.map(r => r.toJSON())
            this.allCategories = json.map(x=> this.tagRepo.builder.buildFromSchema(x))
        })
    }

    handleTagEdit = (event: React.SyntheticEvent) => { 
        const target = event.target as HTMLInputElement 
        this.editingTag.name = target.value
    }

    testAddTag(name: string) {
        let tag = new Tag(this.editingTag.name)
        this.tagEditor.submit(this.tagRepo.add(tag)).finally(()=> this.editingTag = new Tag(""))
    }


    addTag(name: string) {
        console.log('tag')
        let tag = new Tag(name)
        this.tagRepo.add(tag)
    }
    
    addCategory(name: string) {
        let category = new Tag(name)
        category.isTag = false
        this.tagRepo.add(category)
    }

}