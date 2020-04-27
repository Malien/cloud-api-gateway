"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const package_json_1 = require("./package.json");
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const { BIND_IP, PORT, AUTH_SERVICE_URL } = process.env;
const app = express_1.default();
const forward = (url) => {
    const proxy = express_http_proxy_1.default(url);
    return (req, res, next) => proxy(req, res, next);
};
app.all("/auth", forward(AUTH_SERVICE_URL));
app.get("/serviceinfo", (req, res) => {
    res.end(JSON.stringify({ ok: true, version: package_json_1.version, author: package_json_1.author, name: package_json_1.name }));
});
const port = parseInt(PORT);
if (isNaN(port))
    throw Error("Port is expected to be an integer");
app.listen(port, BIND_IP, 10000, () => {
    console.log(`Started API Gatway server on ${BIND_IP}:${PORT}`);
});
