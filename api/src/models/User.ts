import * as bcrypt from "bcryptjs"
import * as uuid from "uuid"

export interface UserPub {
    id: string
    username: string
    email: string
    name: string
    status: number
    createdAt: Date
    updatedAt?: Date
    groupId: number
    clientId: string | null
}

export interface User extends UserPub {
    passwordHash?: string
}

export const createUser = async (email: string, password: string, groupId: number = 1, clientId: string|null = null) => {
    const id = uuid.v4()
    const username = id
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const status = 1
    const name = ""
    const createdAt = new Date()

    const user: User = {
        id,
        email,
        username,
        passwordHash,
        groupId,
        clientId,
        status,
        name,
        createdAt
    }

    return user
}