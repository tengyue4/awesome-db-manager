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


## License

Copyright (c) 2018-2018 Yue Teng (tengyue4@gmail.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
