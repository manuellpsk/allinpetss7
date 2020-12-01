const mysql= require('mysql');
const {promisify}= require('util');
const {database}= require('./keys');

const pool= mysql.createPool(database);

pool.getConnection((err, connection)=>{
    if(err){
        if(err.code=== 'PROTOCOL_CONNECTION_LOST'){
            console.log('SE PERDIO CONECCION CON DB');
        }
        if(err.code=== 'ER_CON_COUNT_ERROR'){
            console.log('MUCHAS CONEXIONES');
        }
        if(err.code=== 'ECONNREFUSED'){
            console.log('CONEXION PERDIDA');
        }
        return    
    }
    if(connection){
        connection.release();
        console.log('DB esta conectada');
    }
    return;
});

//convirtiendo querys para sync away
pool.query= promisify(pool.query);

module.exports= pool;