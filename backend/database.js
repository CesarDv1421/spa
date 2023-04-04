import mysql from 'mysql2/promise';

//Conectar credenciales con la DB
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user:  process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || "@Cesar28588786",
    database: process.env.DB_NAME || 'db'
});

pool.getConnection((err, conection) => {

    if (err) {

        //validando algunos errores

        if (err.code === 'PROTOCOL_CONNECTION_LOST') console.error('La conexion con la base de datos se ha cerrado');

        if (err.code === 'ER_CON_COUNT_ERROR') console.error('La conexion tiene muchas conexiones');

        if (err.code === 'ECONNREFUSED') console.error('La conexion a la base de datos fue rechazada');

    }

    if (conection) conection.release(); //Si no hay ningun error, empieza la conexion

    return console.log('La base de datos esta conectada');
})

export default pool;