const mysql=require('mysql2/promise')
module.exports=mysql.createConnection({
    host: '175.178.17.67',
    port: 3306,
    user: '175_178_17_67',
    password: 'Basis2023',
    database: '175_178_17_67',
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 60000,
    ssl: {
        rejectUnauthorized: false
    }
})
pool.getConnection()
    .then(conn=>{
        console.log('Connected to database!');
        conn.release();
    })
    .catch(err=>{
        console.error('Database connection failed:', err);
        process.exit(1);
    });
module.exports=pool;