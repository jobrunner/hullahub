import { NextFunction, Request, Response } from "express"
import * as Error from "../errors"

// Returns always full open CORS Headers
export const corseAll = async (request: Request, response: Response, next: NextFunction) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "*");
    response.setHeader("Access-Control-Allow-Headers", "*");
    next()
}

// Returns always Not Found status. Usage as a final response
export const finaly404 = async (request: Request, response: Response, next: NextFunction) => {
    const error = new Error.NotFoundError
    response.status(error.status).send(error.json);
}
