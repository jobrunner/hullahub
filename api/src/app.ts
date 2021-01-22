import express from "express"
import logger from "morgan"
import * as bodyParser from "body-parser"
import * as routes from "./routes"
import * as middleWare from "./middleware"
import config from "./config"

const app = express()

app.use(logger(config.MORGAN_LOGGING_FORMAT))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(middleWare.defaults.corse)

const authInTheMiddle = [middleWare.defaults.version, middleWare.auth.authorize, middleWare.auth.loggedInOnly]

app.use("/api/:version(\\d+)", middleWare.defaults.version, routes.auth.route)
app.use("/api/:version(\\d+)", authInTheMiddle, routes.user.route)

app.use(middleWare.defaults.finallyNotFound)

app.listen(config.NODE_PORT, config.NODE_ADDR, () => {
    console.log(`Server running on ${config.NODE_ADDR}:${config.NODE_PORT}`)
}).on('error', (error: Error) => {
    console.log(error)
    process.exit(1)
})