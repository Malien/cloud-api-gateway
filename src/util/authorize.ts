import { Request, Response } from "express";
import axios from "axios";
import { credentials } from "grpc";
import { wrapAPI, APIError } from "./api";
import { AuthClient } from "../protobuf-gen/auth_grpc_pb";
import { Token, TokenPayload } from "../protobuf-gen/auth_pb";

const { AUTH_VERIFICATION_SERVICE_URL } = process.env

const client = new AuthClient(AUTH_VERIFICATION_SERVICE_URL!, credentials.createInsecure())

const verifyRPC = (request: Token) =>
    new Promise<TokenPayload>((resolve, reject) =>
        client.verify(request, (error, response) => {
            if (error) reject(error)
            else resolve(response)
        })
    )

export default (url: string, routes?: string[]) =>
    wrapAPI(async (req: Request, res: Response) => {
        const route = req.path.replace(`$${req.baseUrl}`, "")
        const authorized = !routes || routes.findIndex(authorizedRoute => route.startsWith(authorizedRoute)) != -1
        const headers = req.headers

        if (authorized) {
            const authHeader = headers["authorization"]
            if (!authHeader) throw new APIError("Token is not present", 401)
            const [bearer, token] = authHeader.split(" ")
            if (bearer.toLowerCase() != "bearer") throw new APIError("Token expected to be of bearer type")
            const request = new Token()
            request.setToken(token)
            try {
                const payload = await verifyRPC(request)
                delete headers["authorization"]
                headers["user-id"] = payload.getId().toString()
            } catch (e) { throw new APIError(e.message, 401) }
        }

        const redirectResponse = await axios({
            method: req.method as any,
            url: url + route,
            data: req.body,
            headers
        })

        res.statusCode = redirectResponse.status
        res.statusMessage = redirectResponse.statusText
        Object.entries<string | string[]>(redirectResponse.headers)
            .forEach(([header, value]) => res.setHeader(header, value))
        return redirectResponse.data
    })