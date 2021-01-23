import { Router } from "express"
import * as controller from "../controllers"
import { allowAdmins } from "../middleware/auth"

const router: Router = Router({caseSensitive: true, mergeParams: true})

// Retrive a user list
// Sorting: 
router.get("/users", allowAdmins, controller.user.searchAction)

// Retrive a single User
router.get("/users/:userId", allowAdmins, controller.user.retrieveAction)

// Remove a user (user self or admin or a manager of a membership)
router.delete("/users/:userId", allowAdmins, controller.user.removeAction)

// Create a new user
router.post("/users", allowAdmins, controller.user.createAction)

// Changes a user differes from register (admin only or manager of a membership)
router.put("/users/:userId", allowAdmins, controller.user.updateAction)

// Changes the field values in the specified users
router.put("/users", allowAdmins, controller.user.updateAction)

export { router as route }