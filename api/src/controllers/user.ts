import { Request, Response } from "express"
import { NotFoundError } from "../errors"
import * as services from "../services"
import { HashTable } from "../services"

export const retrieveAction = async (request: Request, response: Response): Promise<void> => {
    const predicateDescriptor: HashTable<string> = {id: request.params.id}
    const limitDescriptor = {offset: 0, rowCount: 1}
    try {
        
        const users = await services.user.search(predicateDescriptor, undefined, limitDescriptor)
        if (users === undefined) {
            throw new NotFoundError("User not found")
        }
        // @todo here is another type foo to resolve
        // if (users.meta.records == 1) {
        response.send(users)
        // }
        // else {
        //     throw new NotFoundError("User not found")
        // }
    } catch (error) {
        console.log(error)
        response.status(404).send({"error": "User not found"})
    }
}

export const searchAction = async (request: Request, response: Response): Promise<void> => {
    const fieldWhiteList = [
        "id", "email", "username", "group_id", "status",
    ]
    const sortWhiteList = [
        "id", "email", "username", "created_at", 
        "updated_at", "group_id", "status",
    ]
    const sortDescriptor = request.query.sort as string
    const filterDescriptor = request.query as HashTable<string>
    const limiterDescriptor = request.query.page as string

    const filterDescription = services.parseFilters(filterDescriptor, fieldWhiteList)
    const orderDescription = services.parseOrderBy(sortDescriptor, sortWhiteList)
    const limitDescription = services.parseLimiter(limiterDescriptor)
    
    try {
        const users = await services.user.search(filterDescription, orderDescription, limitDescription)
        console.log(users)
        response.send(users)
    } catch (error) {
        console.log(error)
        response.status(400).send({"error": "Bad Request"})
    }
}

export const removeAction = async (request: Request, response: Response): Promise<void> => {
    response.status(400).send({"message": "Bad Request delete"})
}

export const updateAction = async (request: Request, response: Response): Promise<void> => {
    response.status(400).send({"message": "Bad Request update"})
}

export const createAction = async (request: Request, response: Response): Promise<void> => {
    response.status(400).send({"message": "Bad Request create"})
}