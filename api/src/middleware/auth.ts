import { NextFunction, Request, Response } from "express"
import config from "../config"
import jwt from "jsonwebtoken"
import * as Error from "../errors"

const authorize = async (request: Request, response: Response): Promise<void> => {
    if (response.locals.authorized) {
        return
    }

    let token = request.header('Authorization')
    if (!token) {
        throw new Error.UnauthorizedError()
    }

    try {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft()
        }
        const verified = jwt.verify(token, config.APP_TOKEN_SECRET)
        response.locals.authorized = verified
    }
    catch (error) {
        throw new Error.UnauthorizedError(error.message)
    }
}

export const allowClients = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    // Access tbd. Currently a client can access others "clients" ressources...
    try {
        await authorize(request, response)
        let groupId = parseInt(response.locals.authorized.gid)
        if (groupId !== NaN && groupId > 0 && groupId < 4) {
            next()
            return
        }
        throw new Error.UnauthorizedError()
    }
    catch {
        const error = new Error.UnauthorizedError()
        response.status(error.status).send(error.json);
    }
}

export const allowOwners = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        await authorize(request, response)
        let groupId = parseInt(response.locals.authorized.gid)
        if (groupId !== NaN && groupId === 1) {
            next()
            return
        }

        if (groupId !== NaN && groupId >= 2 && groupId <= 3) { 
            let request_url = request.baseUrl + request.route.path
            let userId = response.locals.authorized.uid
            if (request_url.includes("users/:userId") && parseInt(request.params.userId) === userId) {
                next()
                return 
            }
        }
        throw new Error.UnauthorizedError()
    }
    catch {
        const error = new Error.ForbiddenError()
        response.status(error.status).send(error.json);
    }
}

export const allowClientManagers = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        await authorize(request, response)
        let groupId = parseInt(response.locals.authorized.gid)
        if (groupId !== NaN && groupId === 1) {
            next()
            return
        }
        if (groupId !== NaN && groupId === 2) { 
            let request_url = request.baseUrl + request.route.path
            let clientId = response.locals.authorized.cid
            if (request_url.includes("/:clientId") && request.params.clientId === clientId) {
                next()
                return 
            }
        }
        throw new Error.UnauthorizedError()
    }
    catch {
        const error = new Error.ForbiddenError()
        response.status(error.status).send(error.json);
    }
}

export const allowAdmins = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        await authorize(request, response)
        let groupId = parseInt(response.locals.authorized.gid)
        if (groupId !== NaN && groupId === 1) {
            next()
            return
        }
        throw new Error.UnauthorizedError()
    }
    catch {
        const error = new Error.ForbiddenError()
        response.status(error.status).send(error.json);
    }
}