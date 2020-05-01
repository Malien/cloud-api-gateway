import express from "express"
import proxy from "express-http-proxy";
import authorize from "./util/authorize";
import bodyparser from "body-parser";

const { BIND_ADDRESS, PORT, AUTH_SERVICE_URL, USER_SERVICE_URL } = process.env

const app = express()

app.use(bodyparser.json())
app.use("/auth", proxy(AUTH_SERVICE_URL!))
app.use("/user", authorize(USER_SERVICE_URL!, ["/me", "/avatar", "/change"]))
app.get("/serviceinfo", (_, res) => {
    res.end(JSON.stringify({
        ok: true,
        version: "0.1.0",
        author: "q_link0_p",
        service: "api-gateway"
    }))
})

const port = parseInt(PORT!)
if (isNaN(port)) throw Error("Port is expected to be an integer")
app.listen(port, BIND_ADDRESS!, 10000, () => {
    console.log(`Started API Gatway server on ${BIND_ADDRESS}:${PORT}`)
})