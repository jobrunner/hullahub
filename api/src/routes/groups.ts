import { Router } from "express"
import * as controller from "../controllers"
import { allowAdmins } from "../middleware/auth"

const router: Router = Router({caseSensitive: true, mergeParams: true})

router.get("/groups", allowAdmins, controller.group.defaultAction)

export { router as route }