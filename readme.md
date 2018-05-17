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

---
## DB tables initialization

You just need to define your table schemas and put those into an array. The init([tables]) will figure out
what the dependencies are between your tables. It will first perform drop all and recreate all the tables
based on all the references. Please refer to the following example:

```js
const   { DBConnector }     =   require('awesome-db-manager');

const Postgres = new DBConnector("Postgres", {
    host: 'localhost',
    port: '5432',
    user: 'mydude2',
    password: 'mybadass',
    database: 'my_db'
});

const PgConnPool = Postgres.newPool(10);

const tables = [{
    name: 'event_templates',
    script: `
    create table event_templates (
        id serial not null primary key,
        organization_id integer references organizations (id),
        name varchar(256) not null,
        title varchar(256),
        address varchar(512),
        start_time varchar(64),
        end_time varchar(64),
        limit_size integer,
        fee decimal(7, 2) default 0.0,
        description text
    )
    `
}, {
    name: 'events',
    script: `
    create table events (
        id serial not null primary key,
        organization_id integer references organizations (id),
        title varchar(256) not null,
        date date not null,
        address varchar(512) not null,
        start_time varchar(64) not null,
        end_time varchar(64) not null,
        limit_size integer,
        fee decimal(7, 2) default 0.0,
        description text,
        create_time timestamp default current_timestamp
    )
    `
},{
    name: 'users',
    script: `
    create table users (
        id serial not null primary key,
        openid varchar(256) not null unique,
        nick_name varchar(128),
        real_name varchar(128),
        phone_number varchar(128),
        avatar_url varchar(256) not null,
        gender varchar(64) not null,
        city varchar(128),
        province varchar(128),
        create_time timestamp default current_timestamp
    );
    `
},{
    name: 'organizations',
    script: `
    create table organizations (
        id serial not null primary key,
        user_id integer references users (id),
        name varchar(256) not null unique,
        logo_url varchar(256) not null,
        category varchar(128) not null,
        province varchar(128) not null,
        city varchar(128) not null,
        area varchar(128) not null,
        image_urls varchar(256) array not null,
        description text,
        create_time timestamp default current_timestamp
    )
    `
},{
    name: 'enrollment',
    script: `
    create table enrollment (
        user_id integer references users (id),
        event_id integer references events (id),
        create_time timestamp default current_timestamp,
        primary key(user_id, event_id)
    )
    `
}];


Postgres.init(tables)
.then(() => {
    console.log('Initialized all the tables.');
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
