import dotenv from "dotenv"
import { Secret } from "jsonwebtoken"

dotenv.config()

export default {
    DB_HOST: process.env.MYSQL_HOST || "localhost",
    DB_USER: process.env.MYSQL_USER,
    DB_PASSWORD: process.env.MYSQL_PASSWORD,
    DB_NAME: process.env.MYSQL_DBNAME,
    DB_PORT: Number(process.env.MYSQL_PORT || 3306),
    NODE_PORT: Number(process.env.NODE_PORT || 3001),
    NODE_ADDR: String(process.env.NODE_ADDR || "127.0.0.1"),
    NODE_ENV: process.env.NODE_ENV || "development",
    MORGAN_LOGGING_FORMAT: process.env.MORGAN_LOGGING_FORMAT || "tiny",
    APP_TOKEN_SECRET: process.env.APP_TOKEN_SECRET as Secret,
    APP_TOKEN_JWT_ALG: String(process.env.APP_TOKEN_JWT_ALG || "HS256"),
    APP_TOKEN_EXPIRATION: Number(process.env.APP_TOKEN_EXPIRATION || 60 * 60) // 1h
}