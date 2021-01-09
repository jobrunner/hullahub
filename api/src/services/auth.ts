import jwt from "jsonwebtoken"
import * as bcrypt  from "bcryptjs"
import * as uuid from "uuid"
import { RowDataPacket } from "mysql2"
import { connectionPool } from "./mysql"
import config from "../config"
import * as models from "../models"
import * as userService from "./user"
import { LoginError,
         CreateError, 
         NotFoundError } from "../errors"

export const login = async (login: string, password: string) => {
    const user = await findBylogin(login)
    if (user.password_hash == undefined) {
        throw new LoginError("Login not possible")
    }
    await bcrypt.compare(password, user.password_hash)

    // Achtung: je nach neuen Ressourcen, die der Anwender zugreifen darf,
    //          muss das token angepasst werden. D.h., ein User muss, wenn dieser
    //          Fall eintrat, ein neues Token anfordern! => refresh

    // create the JWT
    return jwt.sign({
        alg: config.APP_TOKEN_JWT_ALG,
        typ: "JWT",
        uid: user.id,
        gid: user.group_id
    }, config.APP_TOKEN_SECRET as jwt.Secret)
}

export const register = async (username: string, email: string, password: string) => {
    // @todo Ein bisschen mehr, darf es dann doch schon sein... => joi
    if (!username || !email || ! password) {
        throw new CreateError("Must be username, email and password")
    }

    const userId = uuid.v4()
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const createdAt = new Date()
    const status = 1
    const groupId = 1

    const user: models.User = {
        id: userId,
        username: username || uuid.v4(),
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
        console.log(error)
        throw new CreateError(error)
    }    
}

const findBylogin = async (value: string): Promise<models.User> => {
    const sql = "SELECT * FROM user WHERE username = ? OR email = ? LIMIT 1"
    const params = [value, value]
    
    // let rows: Array<Model.User> = []
    // const [rows]: [Array<Model.User>] = await connectionPool.query(sql, params);
    const [rows] = await connectionPool.query<RowDataPacket[]>(sql, params);
    console.log(rows)

    if (rows.length) {
        return rows[0] as models.User
    } else {
        throw new NotFoundError("User does not exist");
    }
}