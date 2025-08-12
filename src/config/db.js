// config/db.js
const sql = require('mssql');
const dotenv = require("dotenv");
const { logInfo, logError } = require('../utils/logger');

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT), // penting: pastikan ini angka
    database: process.env.DB_NAME,
    pool: {
        max: 10, // jumlah maksimum koneksi di pool
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool;

const getPool = async () => {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            logInfo('Connected to SQL Server.');
        } catch (err) {
            logError('Database connection failed:', err);
            throw err;
        }
    }
    return pool;
};

module.exports = {
    getPool,
    sql
};
