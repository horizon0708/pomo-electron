import RxDB, { RxDatabase } from 'rxdb'
import { PomoStatus } from '../models/pomo';
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

const _pomoProject = {
    ratio: {
        type: "number"
    },
    projectId: {
        type: "string"
    }
}

export interface schemaProject{
    ratio: number
    projectId: string
}

export interface schemaPomo {
    id: string
    timestamp: schemaTimestamp 
    breakTimestamp?: schemaTimestamp 
    pauseTimestamps?: schemaTimestamp[] 
    projects: schemaProject[]
    status: number
    currentTime: number
    previousStatus: number
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
        } ,
        projects: {
            type: 'array',
            item: _pomoProject
        },
        status: {
            type: 'number'
        },
        currentTime: {
            type: 'number',
            min: 0
        },
        previousStatus: {
            type: 'number'
        },
    }
}

let _getDatabase: Promise<RxDatabase>; // cached
export function getDatabase(adapter:string): Promise<RxDatabase> {
    if (!_getDatabase) _getDatabase = createDatabase(adapter);
    return _getDatabase;
}

async function createDatabase(adapter:string ) {
    const db = await RxDB.create({
        name: "pomodb",
        adapter,
    })

    console.log('creating pomo collection...')
    await db.collection({
        name: "pomos",
        schema: PomoSchema
    })

    return db;
}
