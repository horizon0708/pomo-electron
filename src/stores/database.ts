import RxDB, { RxDatabase } from 'rxdb'
import { PomoStatus } from '../models/pomo';
import Project, { ProjectStatus } from '../models/project';
import { projectSchema } from './projectSchema';
import { interruptionSchema } from './interruptionSchema';
import ProjectBuilder from '../helper/projectBuilder';
import { tagSchema } from './tagSchema';
RxDB.plugin(require('pouchdb-adapter-http'));
RxDB.plugin(require('pouchdb-adapter-idb'));


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

export interface schemaPomo {
    id: string
    timestamp: schemaTimestamp
    breakTimestamp?: schemaTimestamp
    pauseTimestamps?: schemaTimestamp[]
    project?: string
    status: number
    currentTime: number
    previousStatus: number
    rating: number
    interruptions: string[]
}



const PomoSchema = {
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
            item: _pomoTimestamp
        },
        project: {
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
            item: {
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
    const db = await RxDB.create({
        name,
        adapter,
    })

    console.log('creating pomo collection...')
    await db.collection({
        name: "pomos",
        schema: PomoSchema
    })

    await db.collection({
        name: "projects",
        schema: projectSchema
    })

    await db.collection(
        {
            name: "interruptions",
            schema: interruptionSchema
        }
    )

    await db.collection(
        {
            name: "tags",
            schema: tagSchema
        }
    )


    const projects = db.projects.find().exec()
    projects.then(x => {
        if (x.length === 0) {
            const pBuilder = new ProjectBuilder()
            const seedProjects = [new Project("test1-m"), new Project("test2-m")]
            seedProjects.forEach(x => {
                db.projects.insert(pBuilder.exportToSchema(x))
            })
        }
    })


    return db;
}

