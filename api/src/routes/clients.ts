import { Router } from "express"
import * as controller from "../controllers"
import { allowAdmins } from "../middleware/auth"

const router: Router = Router({caseSensitive: true, mergeParams: true})

// Retrive a client list
router.get("/clients", allowAdmins, controller.client.defaultAction)

// Retrive a single client
router.get("/clients/:clientId", allowAdmins, controller.client.defaultAction)

// Remove a client (user self or admin or a manager of a membership)
router.delete("/clients/:clientId", allowAdmins, controller.client.defaultAction)

// Create a new client
router.post("/clients", allowAdmins, controller.client.defaultAction)

// Changes a client
router.put("/clients/:clientId", allowAdmins, controller.client.defaultAction)

// Changes the field values in the specified users
router.put("/clients", allowAdmins, controller.client.defaultAction)

export { router as route }