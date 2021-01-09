import mysql from "mysql2"
import config from "../config"

export * from "mysql2"

const pool = mysql.createPool({
    host: config.DB_HOST,
    database: config.DB_NAME,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export const connectionPool = pool.promise()