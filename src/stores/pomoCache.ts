import { Pomo, PomoStatus, PomoTimestamp } from "../models/pomo";
import PomoBuilder from "../models/pomoBuilder";

const currentPomo = "CURRENT_POMO";

export default class PomoCache {
  builder = new PomoBuilder();

  // need to save as paused state, inorder for the timer to work properly
  save(pomo: Pomo) {
    const _pomo = Object.assign({}, pomo)
    _pomo.status = PomoStatus.inPause
    _pomo.previousStatus = PomoStatus.inPause
    _pomo.pauseTimestamps.push(new PomoTimestamp(new Date()))
    const value = JSON.stringify(_pomo);
    localStorage.setItem(currentPomo, value);
  }

  load() {
    const output = localStorage.getItem(currentPomo);
    if (output) {
      const json = JSON.parse(output);
      console.log(json)
      return this.builder.buildFromJSON(json);
    }
    return new Pomo()
  }

  reset() {
    localStorage.setItem(currentPomo, JSON.stringify(new Pomo()))
  }
}
