const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexion a BD fue cerrada');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('BD tiene muchas conexiones');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexion a BD fue rechazada');
        }
    }

    if (connection) connection.release();
    console.log('DB conectada');
    return;

});

// Primisify Pool Querys

pool.query = promisify(pool.query);

module.exports = pool;
