import { Pomo, PomoStatus, PomoTimestamp } from "../models/pomo";
import PomoBuilder from "../helper/pomoBuilder";

const currentPomo = "CURRENT_POMO";

export default class PomoCache {
  builder = new PomoBuilder();

  // need to save as paused state, inorder for the timer to work properly
  save(pomo: Pomo) {
    const _pomo = Object.assign({}, pomo)
    _pomo.status = PomoStatus.inPause
    _pomo.previousStatus = PomoStatus.inPause
    _pomo.pauseTimestamps = [..._pomo.pauseTimestamps, new PomoTimestamp()]
    _pomo.currentTime = 0
    const value = JSON.stringify(_pomo);
    localStorage.setItem(currentPomo, value);
  }

  load() {
    const output = localStorage.getItem(currentPomo);
    if (output) {
      const json = JSON.parse(output);
      console.log(json)
      const pomo = this.validateJSON(json)
      console.log("validating json")
      if(!pomo || pomo.currentTime < 3000) return new Pomo()
      pomo.currentTime = pomo.workDurations
      console.log("loaded a pomo from local storage!")
      return pomo
    }
    return new Pomo()
  }
  
  validateJSON(json: any): Pomo | null {
    const fieldExists =
      json.id 
      && json.timestamp
      && json.pauseTimestamps
      && json.projects
      && json.status
      && json.previousStatus

      if(fieldExists) {
        return this.builder.buildFromJSON(json)
      }
      return null
  }

  reset() {
    localStorage.removeItem(currentPomo)
  }
}
