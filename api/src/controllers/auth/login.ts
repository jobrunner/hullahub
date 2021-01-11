import { Request, Response } from "express"
import * as Error from "../../errors"
import * as services from "../../services"

// Login
// Expects login (can be either username or email) and password in the request
export const loginAction = async (request: Request, response: Response) => {    
    let login = request.body.login
    let password = request.body.password
    if (!login || !password) {
        const e = new Error.BadRequestError()
        return response.status(e.status).send(e.json)
    }

    try {
        let token = await services.auth.login(login, password)
        return response.header("Authorization", "Bearer " + token).send({"jwt": token})
    }
    catch {
        const e = new Error.NotFoundError("User not found")
        return response.status(e.status).send(e.json)
    }
}