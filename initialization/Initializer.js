'use strict'

class Initializer {

    constructor(tables){

        this.tables = tables.map(({name, script}) => ({
            name: name.toLowerCase(),
            script: script.toLowerCase()
        }));

        this.tableMetas = [];
        this.tables.forEach(({name, script}) => {
            let row = { name, dependencies: [] };
            while(script.indexOf('references') !== -1){
                let refIndex = script.indexOf('references');
                script = script.slice(refIndex + 10).trim();
                let i = 0;
                while(script[i] !== ' ' && script[i] !== '('){
                    i++;
                }
                row.dependencies.push(script.slice(0, i).trim());
            }
            this.tableMetas.push(row);
        });
    }

    generateOrder(){
        let copyMetas = JSON.parse(JSON.stringify(this.tableMetas));
        this.tableOrder = [];
        while(copyMetas.length){
            for(let i = 0; i < copyMetas.length; i++){
                if(copyMetas[i].dependencies.every(name => this.tableOrder.includes(name))){
                    this.tableOrder.push(copyMetas[i].name);
                    copyMetas.splice(i, 1);
                    break;
                }
            }
        }
        return this.tableOrder.map(name => this.tables[this.tables.findIndex(table => table.name === name)]);
    }

}

module.exports = Initializer;
