import express, { Request, Response, NextFunction } from "express"
import { version, author, name } from "./package.json"
import httpProxy from "express-http-proxy";

const { BIND_ADDRESS, PORT, AUTH_SERVICE_URL } = process.env

const app = express()

const forward = (url: string) => {
    const proxy = httpProxy(url)
    return (req: Request, res: Response, next: NextFunction) => proxy(req, res, next)
}

app.all("/auth", forward(AUTH_SERVICE_URL!))
app.get("/serviceinfo", (req, res) => {
    res.end(JSON.stringify({ ok: true, version, author, name }))
})

const port = parseInt(PORT!)
if (isNaN(port)) throw Error("Port is expected to be an integer")
app.listen(port, BIND_ADDRESS!, 10000, () => {
    console.log(`Started API Gatway server on ${BIND_ADDRESS}:${PORT}`)
})