'use strict'

const   DBs             =   require('./DBs'),
        Initializer     =   require('../initialization/Initializer');


function dropTables(pool, tables){
    if(!tables.length){
        return Promise.resolve();
    }
    return pool.query(`drop table if exists ${tables.pop().name}`)
    .then(() => dropTables(pool, tables));
}

function createTables(pool, tables){
    if(!tables.length){
        return Promise.resolve();
    }
    return pool.query(tables.splice(0, 1)[0].script)
    .then(() => createTables(pool, tables));
}


class DBConnector {

    constructor(dbType, dbConfig){
        if(dbType !== "Mysql" && dbType !== "Postgres"){
            throw new Error('Unable to identify database type!');
        }else{
            this.dbType = dbType;
        }
        this.config = {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database
        };
    }

    newPool(size){
        this.pool = new DBs[this.dbType](this.config, size);
        return this.pool;
    }

    init(tables){
        if(!this.pool){
            throw new Error(`DB connection haven't established!`);
        }
        const initializer = new Initializer(tables);
        const orderedTables = initializer.generateOrder();
        return dropTables(this.pool, JSON.parse(JSON.stringify(orderedTables)))
        .then(() => createTables(this.pool, JSON.parse(JSON.stringify(orderedTables))))
        .then(() => {
            this.pool.close();
            console.log(`Initialized all the tables.`);
            return Promise.resolve();
        });
    }

}


module.exports = DBConnector;
