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
app.use("/api/:version(\\d+)", routes.auth.route)
app.use("/api/:version(\\d+)", routes.users.route)
app.use("/api/:version(\\d+)", routes.groups.route)
app.use("/api/:version(\\d+)", routes.clients.route)
app.use(middleWare.defaults.finallyNotFound)

app.listen(config.NODE_PORT, config.NODE_ADDR, () => {
    console.log(`Server running on ${config.NODE_ADDR}:${config.NODE_PORT}`)
}).on('error', (error: Error) => {
    console.log(error)
    process.exit(1)
})