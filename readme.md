# awesome-db-manager

## Install

```sh
$ npm install awesome-db-manager
```

---
## Introduction

This is a node.js DB connection wrapper for mysql & postgres. It is written in JavaScript, does not
require compiling.

Here is an example on how to use it for Mysql:

```js
const   { DBConnector }     =   require('awesome-db-manager');

const mysqlConfig = {
    host: 'localhost',
    port: '3306',
    user: 'mydude',
    password: 'mybadass',
    database: 'my_db'
};

const Mysql = new DBConnector("Mysql", mysqlConfig);

// Initialize a connection pool with size 5
const mysqlConnPool = Mysql.newPool(5);

mysqlConnPool.query(`select * from test_table where some_id = ?`, [8])
.then(([row]) => {
    console.log(row);
    return mysqlConnPool.query(`select * from test_table_2 where another_id = ?`, [row.another_id]);
}).then(([row_2]) => {
    console.log(row_2);
    mysqlConnPool.close();
});
```

For Postgres:

```js
const   { DBConnector }     =   require('awesome-db-manager');

const mysqlConfig = {
    host: 'localhost',
    port: '5432',
    user: 'mydude2',
    password: 'mybadass',
    database: 'my_db'
};

const Postgres = new DBConnector("Postgres", mysqlConfig);

// Initialize a connection pool with size 15
const pgConnPool = Postgres.newPool(15);

Promise.all([
    pgConnPool.query(`select * from test_table where some_id = $1 and another_name = $2`, [8, 'Jone']),
    pgConnPool.query(`select * from test_table_2 where name = $1`, ['Victor'])
]).then(([{rows: firstResult}, {rows: secondResult}]) => {
    console.log(`firstResult: ${firstResult}`);
    console.log(`secondResult: ${secondResult}`);
    pgConnPool.close();
});

```
