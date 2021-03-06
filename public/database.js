const RxDB = require('rxdb')
RxDB.plugin(require('pouchdb-adapter-http'));
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



const _pomoProject = {
    ratio: {
        type: "number"
    },
    projectId: {
        type:  "string"
    }
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
        pauseTimestamps: _pomoTimestamp,
        projects: {
            type: 'array',
            item: _pomoProject
        },
        status: {
            type: 'string'
        },
        currentTime: {
            type: 'number',
            min: 0
        },
        previousStatus: {
            type: 'string'
        },
    }
}

let _getDatabase; // cached
function getDatabase(adapter) {
    if (!_getDatabase) _getDatabase = createDatabase(adapter);
    return _getDatabase;
}

 async function createDatabase(adapter) {
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

module.exports ={
    getDatabase
}