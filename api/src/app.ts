import express from "express"
import logger from "morgan"
import * as bodyParser from "body-parser"
import * as routes from "./routes"
import { authorize, loggedInOnly } from "./middleware/auth"
import config from "./config"

const app = express()

app.use(logger(config.MORGAN_LOGGING_FORMAT))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/auth", routes.auth.route)
app.use("/api", authorize, loggedInOnly, routes.user.route)

app.listen(config.NODE_PORT, config.NODE_ADDR, () => {
    console.log(`Server running on ${config.NODE_ADDR}:${config.NODE_PORT}`)
}).on('error', (error: Error) => {
    console.log(error)
    process.exit(1)
})