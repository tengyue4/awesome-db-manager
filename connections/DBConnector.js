'use strict'

const   DBs     =   require('./DBs');



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

}


module.exports = DBConnector;
