import "dotenv/config";
import http, { type Server } from "node:http";
import ServerConfig from "./config/ServerConfig";
import { WebSocketServer } from "ws";
import express from "express"
import App from "./config/App";

/** Dependencies */
const serverConfig: ServerConfig = new ServerConfig();
const app: App = new App(express())

/** Create HTTP server */
const httpServer: Server = http.createServer(app.app);
serverConfig.config(httpServer)

/** WebSocket connection */
const ws = new WebSocketServer({ server: httpServer })

/** Start server */
serverConfig.listen(httpServer)
