import { NextFunction, Request, Response } from "express"
import config from "../config"
const jwt: any = require("jsonwebtoken")

// sollte eher "owner" heißten
export const authorize = async (request: Request, response: Response, next: NextFunction) => {
    let token = request.header('Authorization')
    if (!token) {
        response.status(401).send("Access Denied")
        return
    }

    try {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length).trimLeft()
        }
        const verified = jwt.verify(token, config.APP_TOKEN_SECRET)
        response.locals.authorized = verified
        next()
    }
    catch (error) {
        response.status(400).send("Invalid Token")
    }
}

export const loggedInOnly = async (request: Request, response: Response, next: NextFunction) => {
    let groupId = response.locals.authorized.gid
    console.log(response.locals.authorized)

    if (groupId >= 1) {
        return next()
    }  
    return response.status(401).send({"message": "Unauthorized! 1"});
}

export const ownerOnly = async (request: Request, response: Response, next: NextFunction) => {
    let groupId = response.locals.authorized.gid
    if (groupId === 1) {
        next()
    }

    if (groupId <= 2) { 
        let request_url = request.baseUrl + request.route.path
        let userId = response.locals.authorized.uid
        if (request_url.includes("users/:id") && parseInt(request.params.id) === userId) {
            return next()
        }
    }
    return response.status(401).send({"message": "Unauthorized! 2"});
}

export const adminOnly = async (request: Request, response: Response, next: NextFunction) => {
    let groupId = response.locals.authorized.gid
    if (groupId === 1) {
        next()
    }  
    return response.status(401).send({"message": "Unauthorized! 3"});
}