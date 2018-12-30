import { action, observable } from "mobx";
import { PomoPage } from "../components/router";

export default class AppStateStore { 
    @observable route: PomoPage = PomoPage.project

    @action to(page: PomoPage) {
        this.route = page
    }
}