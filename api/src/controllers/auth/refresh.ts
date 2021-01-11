import { Request, Response } from "express"
import * as services from "../../services"
import * as Error from "../../errors"

// Login
export const refreshAction = async (request: Request, response: Response): Promise<void> => {    
    let token = request.header('Authorization')
    if (!token) {
        const e = new Error.BadRequestError()
        response.status(e.status).send(e.json)
        return
    }
    
    try {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft()
        }
        const refreshedToken = await services.auth.refreshToken(token)
        // Success return structure missing!
        response.header("Authorization", "Bearer " + refreshedToken)
                .status(200)
                .send({"jwt": refreshedToken})
    }
    catch (error) {
        const e = new Error.BadRequestError(`Bad Request (${error.message})`)
        response.status(e.status).send(e.json)
    }
}