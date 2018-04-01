"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const redis = require("redis");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const sub = redis.createClient();
const parseMsg = (msg) => msg;
const handleMessage = (ws) => (channel, message) => {
    ws.send(JSON.stringify({
        message: "stuff-from-redis-sent-by-server",
        payload: message
    }));
};
wss.on("connection", (ws) => {
    ws.send("Hi there, I am a WebSocket server");
    ws.on("message", data => {
        const parsedMessage = parseMsg(data.toString());
        if (parsedMessage === 'connect_to_channel') {
            sub.subscribe('nice_channel');
        }
    });
    sub.on("message", handleMessage(ws));
});
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
//# sourceMappingURL=server.js.map