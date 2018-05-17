'use strict'

const   mysql   =   require('mysql');

class Mysql {

    constructor(config, size){
        this.pool = mysql.createPool({
            ...config,
            connectionLimit: size
        });
    }

    query(queryString, variables){
        return new Promise((resolve, reject) => {
            if(variables){
                this.pool.query(queryString, variables, (err, rows) => {
                    if(err){
                        reject(err);
                    }else{
                        resolve(rows);
                    }
                });
            }{
                this.pool.query(queryString, (err, rows) => {
                    if(err){
                        reject(err);
                    }else{
                        resolve(rows);
                    }
                });
            }
        });
    }

    close(){
        this.pool.end();
    }
}

module.exports = Mysql;
