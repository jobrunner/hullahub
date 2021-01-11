import jwt from "jsonwebtoken"
import * as bcrypt  from "bcryptjs"
import * as uuid from "uuid"
import { RowDataPacket } from "mysql2"
import { connectionPool } from "./mysql"
import config from "../config"
import * as models from "../models"
import * as userService from "./user"
import * as Error from "../errors"

export interface VerifyDecoded {
    uid: string 
    gid: string
}

export const login = async (login: string, password: string) => {
    const user = await findBylogin(login)
    if (user.password_hash == undefined) {
        throw new Error.LoginError("Login not possible")
    }
    await bcrypt.compare(password, user.password_hash)

    // create the JWT
    return jwt.sign({
        alg: config.APP_TOKEN_JWT_ALG,
        exp: Math.floor(Date.now() / 1000) + (config.APP_TOKEN_EXPIRATION),
        typ: "JWT",
        uid: user.id,
        gid: user.group_id
    }, config.APP_TOKEN_SECRET as jwt.Secret)
}

export const register = async (email: string, password: string, groupId = 1): Promise<models.User> => {
    // @todo Ein bisschen mehr, darf es dann doch schon sein... => joi
    if (!email || ! password) {
        throw new Error.BadRequestError("Bad Request. Omitted email and/or password")
    }

    const userId = uuid.v4()
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const createdAt = new Date()
    const status = 1

    const user: models.User = {
        id: userId,
        username: userId,
        email: email,
        name: "",
        password_hash: passwordHash,
        status: status,
        created_at: createdAt,
        group_id: groupId
    }

    try {
        await userService.create(user)
        delete user.password_hash
        return user
    }
    catch (error) {
        if (error.code == "ER_DUP_ENTRY") {
            throw new Error.RegisterError("Registration failed: The email address is already in use.")
        }
        throw new Error.RegisterError("Registration failed")
    }    
}

export const refreshToken = async (token: string): Promise<string> => {
    try {
        const verified = jwt.verify(token, config.APP_TOKEN_SECRET) as VerifyDecoded
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (30), // 30s
            alg: config.APP_TOKEN_JWT_ALG,
            typ: "JWT",
            uid: verified.uid,
            gid: verified.gid
        }, config.APP_TOKEN_SECRET as jwt.Secret)
    }
    catch (error) {
        console.log(error)
        throw new Error.RefreshError(error.message)
    }
}

const findBylogin = async (value: string): Promise<models.User> => {
    const sql = "SELECT * FROM user WHERE username = ? OR email = ? LIMIT 1"
    const params = [value, value]
    try {
        const [rows] = await connectionPool.query<RowDataPacket[]>(sql, params);
        if (rows.length) {
            return rows[0] as models.User
        } else {
            throw new Error.NotFoundError("User does not exist");
        }
    }
    catch(error) {
        throw new Error.NotFoundError(error.message);
    }
}
