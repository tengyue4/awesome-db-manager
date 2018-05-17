'use strict'

const { Pool }  =   require('pg');

class Postgres {

    constructor(config, size){
        this.pool = new Pool({
            ...config,
            max: size
        });
    }

    query(queryString, variables){
        return variables ? this.pool.query(queryString, variables) : this.pool.query(queryString);
    }

    close(){
        this.pool.end();
    }

}

module.exports = Postgres;
