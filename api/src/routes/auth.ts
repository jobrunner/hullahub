import { NextFunction, Request, Response, Router } from "express"
import * as controller from "../controllers"

const router: Router = Router({caseSensitive: true})

// Register a new User
router.post("/auth/register", controller.auth.registerAction)

// Login
router.post("/auth/login", controller.auth.loginAction)

// Refresh JWT
router.post("/auth/refresh", controller.auth.refreshAction)

// Verify the user's email address and activates the login
router.get("/auth/verify/:id", (request: Request, response: Response, next: NextFunction) => {
    response.status(200).send("Ok, verified the email")
})

export { router as route }