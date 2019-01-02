import RxDB, { RxDatabase } from 'rxdb'
import { PomoStatus } from '../models/pomo';
import Project, { ProjectStatus } from '../models/project';
import { projectSchema, SchemaProject } from './projectSchema';
import { interruptionSchema, reasonSchema, schemaInterruption } from './interruptionSchema';
import ProjectBuilder from '../helper/projectBuilder';
import { tagSchema, SchemaTag } from './tagSchema';
import { serialize, foreignKey } from '../helper/serializationDecorators';
import { ISchema } from '../helper/validationBuilder';
import { Guid } from 'guid-typescript';
import { C_PROJECTS, C_INTERRUPTIONS, C_POMOS, C_TAGS, C_REASONS } from '../constants/databaseConstants';
RxDB.plugin(require('pouchdb-adapter-http'));
RxDB.plugin(require('pouchdb-adapter-idb'));

    RxDB.plugin(require('pouchdb-adapter-memory'));

//need to be generated into public (or find a way to build electron into main?)
//https://github.com/pubkey/rxdb/blob/master/examples/electron/database.js
const _pomoTimestamp = {
    type: 'object',
    properties: {
        startTime: {
            type: "string"
        },
        endTime: {
            type: "string"
        }
    }
}

export interface schemaTimestamp {
    startTime: string;
    endTime: string;
}

export interface ISchemaPomo extends ISchema {
    id: string
    timestamp: schemaTimestamp
    breakTimestamp?: schemaTimestamp
    pauseTimestamps: schemaTimestamp[]
    project?: SchemaProject
    status: number
    currentTime: number
    previousStatus: number
    rating: number
    interruptions: schemaInterruption[]
}

export class SchemaPomo implements ISchemaPomo{
    @serialize id: string = Guid.create().toString()
    @serialize timestamp: schemaTimestamp = { startTime: new Date().toString(), endTime: new Date().toString()}
    @serialize breakTimestamp?: schemaTimestamp | undefined
    @serialize pauseTimestamps: schemaTimestamp[] = []
    @foreignKey(C_PROJECTS) @serialize project?: SchemaProject | undefined = undefined
    @serialize status: number = 0
    @serialize currentTime: number = 0
    @serialize previousStatus: number =0
    @serialize rating: number = 3
    @foreignKey(C_INTERRUPTIONS) @serialize interruptions: schemaInterruption[] = []
}



export const PomoSchema = {
    title: "Pomo Collection",
    description: "Pomo Schema",
    version: 0,
    type: "object",
    properties: {
        id: {
            type: 'string',
            primary: true
        },
        timestamp: _pomoTimestamp,
        breakTimestamp: _pomoTimestamp,
        pauseTimestamps: {
            type: 'array',
            items: _pomoTimestamp
        },
        project: {
            ref: C_PROJECTS,
            type: 'string'
        },
        status: {
            type: 'number'
        },
        currentTime: {
            type: 'number',
            min: 0
        },
        rating: {
            type: "number"
        },
        interruptions: {
            type: 'array',
             ref: C_INTERRUPTIONS,
            items: {
                type: "string"
            }
        },
        previousStatus: {
            type: 'number'
        },
    }
}


let _getDatabase: Promise<RxDatabase>; // cached
export function getDatabase(name: string, adapter: string): Promise<RxDatabase> {
    if (!_getDatabase) _getDatabase = createDatabase(name, adapter);
    return _getDatabase;
}


export async function createDatabase(name: string, adapter: string) {
    let _adapter = name !== "pomodb" ? "memory" : adapter

    const db = await RxDB.create({
        name,
        adapter: _adapter,
    })



    console.log('creating collections...')

    await db.collection({
        name: C_POMOS,
        schema: PomoSchema
    })

    await db.collection({
        name: C_PROJECTS,
        schema: projectSchema
    })

    await db.collection(
        {
            name: C_INTERRUPTIONS,
            schema: interruptionSchema
        }
    )

    await db.collection(
        {
            name: C_TAGS,
            schema: tagSchema
        }
    )

    await db.collection(
        {
            name: C_REASONS,
            schema: reasonSchema
        }
    )


    if (name !== "pomodb") {
        console.log(name)
        const projectTag = new SchemaTag()
        projectTag.id = "tag1"
        const projectTagTwo = new SchemaTag()
        projectTagTwo.id = "tag2"
        const seedTags = [projectTag, projectTagTwo]
        seedTags.forEach(x => {
            db[C_TAGS].insert(x).then(x=> {
                console.log(x.toJSON())
            })
        })

        const seedProject = new SchemaProject()
        seedProject.id = "seed1"
        seedProject.tags =["tag1"]
        seedProject.category = "tag2"
        db[C_PROJECTS].insert(seedProject).then(x=> {
            console.log((x:any)=>x.toJSON())
        })
    }



    return db;
}

