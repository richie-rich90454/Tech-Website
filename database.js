const mysql=require('mysql2/promise');
const pool=mysql.createPool({
    host: '175.178.17.67',
    port: 3306,
    user: '175_178_17_67',
    password: 'Basis2023',
    database: '175_178_17_67',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
pool.getConnection()
    .then(conn=>{
        console.log('Successfully connected to database');
        conn.release();
    })
    .catch(err=>{
        console.error('DATABASE CONNECTION ERROR:', err);
        process.exit(1);
    });
module.exports=pool;