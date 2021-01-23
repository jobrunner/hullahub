import { Request, Response } from "express";
import * as services from "../../services"
import * as Error from "../../errors"

// Register a new User
export const registerAction = async (request: Request, response: Response): Promise<void> => {
    // schema validation of either username or email and valid strong password
    // @todo with joi

    const email = request.body.email
    const password = request.body.password
    if (!email || !password) {
        const e = new Error.BadRequestError("Bad Request (email or password omitted)")
        response.status(e.status).send(e.json)
        return 
    }

    try {
        const user = await services.auth.register(email, password)
        // @todo Send verification email <here>
        delete user.passwordHash

        // @todo standard return type for single item
        response.status(200).send(user)
    }
    catch (error) {
        const e = new Error.RegisterError(`${error.message}`)
        response.status(e.status).send(e.json)
    }    
}