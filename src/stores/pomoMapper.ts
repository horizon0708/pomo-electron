import { Pomo, PomoTimestamp, PomoStatus } from "../models/pomo";
import { schemaPomo, schemaTimestamp } from "./database";
import { Guid } from "guid-typescript";
import PomoBuilder from "../helper/pomoBuilder";

export default class PomoMapper {
    builder = new PomoBuilder()

    toDB(pomo: Pomo): schemaPomo {
        return this.builder.exportToSchema(pomo)
    }

    fromDB(item: schemaPomo): Pomo {
        return this.builder.buildFromSchema(item)
    }
}