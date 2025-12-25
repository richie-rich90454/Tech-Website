const mysql = require('mysql2/promise');

// Use environment variables for database configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'techwebsite',
    password: process.env.DB_PASSWORD || 'techwebsite07E9',
    database: process.env.DB_NAME || 'TechWebsite',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(conn => {
        console.log('Successfully connected to database');
        conn.release();
    })
    .catch(err => {
        console.error('DATABASE CONNECTION ERROR:', err);
        // Don't exit in production, allow the app to handle connection errors gracefully
        if (process.env.NODE_ENV === 'development') {
            process.exit(1);
        }
    });

module.exports = pool;
