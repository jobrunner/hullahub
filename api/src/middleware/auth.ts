import { NextFunction, Request, Response } from "express"
import config from "../config"
import jwt from "jsonwebtoken"
import * as Error from "../errors"

export const authorize = async (request: Request, response: Response, next: NextFunction) => {
    let token = request.header('Authorization')
    if (!token) {
        const e = new Error.UnauthorizedError()
        response.status(e.status).send(e.json)
        return
    }

    try {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft()
        }
        const verified = jwt.verify(token, config.APP_TOKEN_SECRET)
        response.locals.authorized = verified
        next()
    }
    catch (error) {
        const e = new Error.UnauthorizedError(error.message)
        response.status(e.status).send(e.json)
    }
}

export const loggedInOnly = async (request: Request, response: Response, next: NextFunction) => {
    let groupId = response.locals.authorized.gid
    if (groupId >= 1) {
        return next()
    }  
    const error = new Error.UnauthorizedError()
    response.status(error.status).send(error.json);
}

export const ownerOnly = async (request: Request, response: Response, next: NextFunction) => {
    let groupId = response.locals.authorized.gid
    if (groupId === 1) {
        next()
        return
    }

    if (groupId <= 2) { 
        let request_url = request.baseUrl + request.route.path
        let userId = response.locals.authorized.uid
        if (request_url.includes("users/:id") && parseInt(request.params.id) === userId) {
            next()
            return 
        }
    }
    const error = new Error.ForbiddenError()
    response.status(error.status).send(error.json);
}

export const adminOnly = async (request: Request, response: Response, next: NextFunction) => {
    let groupId = response.locals.authorized.gid
    if (groupId === 1) {
        next()
    }  
    const error = new Error.ForbiddenError()
    response.status(error.status).send(error.json);
}