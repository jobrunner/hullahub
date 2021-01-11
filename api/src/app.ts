import express from "express"
import logger from "morgan"
import * as bodyParser from "body-parser"
import * as routes from "./routes"
import * as middleWare from "./middleware"
import config from "./config"

const app = express()

app.use(logger(config.MORGAN_LOGGING_FORMAT))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", routes.auth.route)
app.use("/api/v1", middleWare.auth.authorize, middleWare.auth.loggedInOnly, routes.user.route)

app.listen(config.NODE_PORT, config.NODE_ADDR, () => {
    console.log(`Server running on ${config.NODE_ADDR}:${config.NODE_PORT}`)
}).on('error', (error: Error) => {
    console.log(error)
    process.exit(1)
})