(function() {
    require('dotenv').config();
    const mySql = require('mysql');
    const DB_HOST = process.env.DB_HOST;
    const DB_USER = process.env.DB_USER;
    const DB_PASS = process.env.DB_PASS;
    const DB_NAME = process.env.DB_NAME;

    const connection = mySql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_NAME,
        password: DB_PASS
    });

    connection.connect((err) => {
        if(err) {
            console.log('error white connecting to Database--->', err)
        } else {
            console.log(`Database connected on port  ${process.env.PORT}!`);
        }
    });

    inserDataToTable = async (tableName, tableData) => {
       return new Promise(async (res, rej) => {
        const date = new Date();
        const todayDate = date.toISOString().split('T')[0] + ' '  + date.toTimeString().split(' ')[0];
        tableData.createdAt = todayDate;
        tableData.updatedAt = todayDate;
        const query = await makeInsertQuery(tableName, tableData);
        const result = await queryRunner(query);
        res(result);
       });
    },

    fetchDataFromTable = async (tableName, condition) => {
        return new Promise(async (res, rej) => {
            let query = null;
            if(condition) {
                query = `SELECT * FROM ${tableName} WHERE ${condition}`
            } else {
                query = `SELECT * FROM ${tableName}`
            }
            const result = await queryRunner(query);
            res(result);
        });
    },

    updateTableData = async (tableName, tableData, identifier, identifierValue) => {
        return new Promise(async(res, rej) => {
            let updateData = '';
            const date = new Date();
            tableData.updatedAt = date.toISOString().split('T')[0] + ' '  + date.toTimeString().split(' ')[0];
            for (const key in tableData) {
                if (tableData.hasOwnProperty(key)) {
                    const element = tableData[key];
                    updateData = updateData + ` ${key} = '${element}' ,`;
                }
            }
            updateData = updateData.substr(0, updateData.length-1);
            const query = `UPDATE ${tableName} SET ${updateData} WHERE ${identifier} = '${identifierValue}'`;
            await queryRunner(query);
            const updateResult = await fetchDataFromTable(tableName, `${identifier} = '${identifierValue}'`);
            res(updateResult);
        });
    },

    deleteRecord = async (tableName, condition) => {
        const query = `DELETE FROM ${tableName} WHERE ${condition}`;
        const status = await queryRunner(query);
        Promise.resolve(status);
    },

    queryRunner = (query) => {
        console.log('Executing query --> ', query);
        return new Promise((res, rej) => {
            connection.query(query, (err, result) => {
                res(result);
            });
        });
    },

    makeInsertQuery = async (tableName, tableData) => {
        return new Promise((res, rej) => {
            let values = '';
            let keys = '';

            for(let [key, value] of Object.entries(tableData)) {
                values = `${values} '${value}',`
                keys = keys + ',' + key
            }
            values = values.substr(0, values.length-1);
            keys = keys.substr(1, keys.length-1);
            const query = `INSERT INTO ${tableName} (${keys}) VALUES (${values});`;
            res(query);
        });
    },
    checkDuplicate = async (tableName, idetifier, idetifierValue) => {
        return new Promise(async (res, rej) => {
            const tableData = await fetchDataFromTable(tableName, `${idetifier} = '${idetifierValue}'`);
            if(tableData.length !== 0) {
                res(tableData);
            } else {
                res(false);
            }
        });
    },

    // joinQuery = (tableName, joinTableName) => {
    //     let query = `SELECT * FROM ${tableName}`;

    // }

    module.exports = {
        inserDataToTable,
        fetchDataFromTable,
        updateTableData,
        checkDuplicate,
        queryRunner,
        deleteRecord
    };
}());


//  join more than two tables

// SELECT * FROM property 
// INNER JOIN countries ON property.country = countries.id
// INNER JOIN pricingmodel on property.pricingModel = pricingmodel.id 
// INNER JOIN states on property.`state` = states.id
// INNER JOIN cities on property.city = cities.id;