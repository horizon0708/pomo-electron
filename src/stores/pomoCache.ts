import { Pomo } from "../models/pomo";
import PomoBuilder from "../models/pomoBuilder";

const currentPomo = "CURRENT_POMO";

export default class PomoCache {
  builder = new PomoBuilder();

  save(pomo: Pomo) {
    const value = JSON.stringify(pomo);
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
