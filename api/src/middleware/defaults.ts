import { NextFunction, Request, Response } from "express"
import * as Error from "../errors"

// Checks if API version is supported and sets up response.locals.apiVersion
export const version = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    if (parseInt(request.params.version) === 1) {
        response.locals.apiVersion = 1
        next()
        return
    }

    const error = new Error.NotFoundError
    response.status(error.status).send(error.json)
}

// Returns always full open CORS Headers
export const corse = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "*");
    response.setHeader("Access-Control-Allow-Headers", "*");
    next()
}

// Returns always Not Found status. Usage as a final response
export const finallyNotFound = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const error = new Error.NotFoundError
    response.status(error.status).send(error.json);
}
