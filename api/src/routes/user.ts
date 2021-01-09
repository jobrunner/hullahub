import * as express from "express"
import * as controller from "../controllers"

const router = express.Router({caseSensitive: true})

// Retrive a user list
router.get("/users", controller.user.searchAction)

// Retrive a single User
router.get("/users/:id", controller.user.retrieveAction)

// Remove a user (user self or admin or a manager of a membership)
router.delete("/users/:id", controller.user.removeAction)

// Create a new user
router.post("/users", controller.user.createAction)

// Changes a user differes from register (admin only or manager of a membership)
router.put("/users/:id", controller.user.updateAction)

export { router as route }