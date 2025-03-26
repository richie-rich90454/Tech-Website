const mysql=require('mysql2/promise');
const pool=mysql.createPool({
    host: '208.109.228.92',
    port: 3306,
    user: 'techwebsite',
    password: 'Basis2023',
    database: 'TechWebsite',
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