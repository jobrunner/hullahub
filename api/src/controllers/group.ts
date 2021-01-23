import { Request, Response } from "express"
import * as Error from "../errors"
import * as services from "../services"

export const defaultAction = async (request: Request, response: Response): Promise<void> => {
    try {
        const groups = await services.group.retrive()
        response.send(groups)
    } catch (error) {
        const e = new Error.BadRequestError(error.message)
        console.log(e.message)
        response.status(e.status).send(e.status)
    }
}