import { NextFunction, Request, Response, Router } from "express"
import * as controller from "../controllers"

const router: Router = Router({caseSensitive: true})

// Register a new User
router.post("/register", controller.auth.registerAction)

// Login
router.post("/login", controller.auth.loginAction)

// Verify the user's email address and activates the login
router.get("/auth/verify/:id", (request: Request, response: Response, next: NextFunction) => {
    response.status(200).send("Ok, verified the email")
})

export { router as authRoute }