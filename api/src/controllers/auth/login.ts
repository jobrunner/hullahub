import { Request, Response } from "express"
import * as services from "../../services"

// Login
// Expects login (can be either username or email) and password in the request
export const loginAction = async (request: Request, response: Response) => {    
    let login = request.body.login
    let password = request.body.password
    if (!login || !password) {
        return response.status(400).send({"message": "Bad Request"})
    }

    try {
        let token = await services.auth.login(login, password)
        return response.header("Authorization", "Bearer " + token).send({"jwt-token": token})
    }
    catch {
        return response.status(404).send({"message": "User not found"})
    }
}