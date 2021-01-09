import { Request, Response } from "express";
import * as services from "../../services"
import * as models from "../../models"

// import { NotFoundError } from "../../helpers/NotFoundError"
// const userService = require("../../services/user")

// Register a new User
export const registerAction = async (request: Request, response: Response) => {
    // schema validation of either username or email and valid strong password
    // @todo with joi

    const email = request.body.email
    const password = request.body.password
    const user = await models.createUser(email, password)

    // das ist mir hier eigentlich zu viel Logic
    // const id = uuid()
    // const name = request.body.name
    const username = request.body.username
    // const salt = await genSalt(10)
    // const password_hash = await hash(password, salt)
    // const created_at = new Date()
    // const group_id = 1
    // const status = 1

    // const user: Model.User = {
    //     id,
    //     username,
    //     email,
    //     name,
    //     password_hash,
    //     group_id,
    //     status,
    //     created_at
    // }

    // Save User in the database
    try {
        // await userService.create(user)
        await services.auth.register(username, email, password)
        // send verification email
        delete user.password_hash
        response.status(200).send(user)
    }
    catch (error) {
        console.log(error)
        response.status(500).send({"error": error.message})
    }    
}