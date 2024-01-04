import "dotenv/config";
import App from "./config/App";
import ServerConfig from "./config/ServerConfig";
import WebSocket from "./config/WebSocket";
import { WebSocketServer } from "ws";
import http, { type Server } from "node:http";
import express from "express";

/** Dependencies */
const serverConfig: ServerConfig = new ServerConfig();
export const app: App = new App(express());

/** Create HTTP server */
const httpServer: Server = http.createServer(app.app);
serverConfig.config(httpServer);

/** WebSocket connection */
const ws: WebSocketServer = new WebSocketServer({ server: httpServer });
new WebSocket(ws).config();

/** Start server */
serverConfig.listen(httpServer);
