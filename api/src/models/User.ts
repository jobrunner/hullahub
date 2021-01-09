import * as bcrypt from "bcryptjs"
import * as uuid from "uuid"

export interface UserPub {
    id: string
    username: string
    email: string
    name: string
    status: number
    created_at: Date
    updated_at?: Date
    group_id: number
}

export interface User extends UserPub {
    password_hash?: string
}

export const createUser = async (email: string, password: string, groupId: number = 1) => {
    const id = uuid.v4()
    const username = email
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)
    const group_id = groupId
    const status = 1
    const name = ""
    const created_at = new Date()

    const user: User = {
        id,
        email,
        username,
        password_hash,
        group_id,
        status,
        name,
        created_at
    }

    return user
}