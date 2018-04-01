import * as express from "express";
import * as http from "http";
import {Server} from "uws";
import * as redis from "redis";
import { listeners } from "cluster";

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

const pub = redis.createClient(6379, process.env.WS_REDIS_HOST);
const sub = redis.createClient(6379, process.env.WS_REDIS_HOST);

const parseMsg = (msg: string) => msg;

const handleMessage = (ws:any) => (channel: string, message: string) => {
  ws.send(
    JSON.stringify({
      message: "stuff-from-redis-sent-by-server",
      payload: message
    })
  );
};

wss.on("connection", (ws) => {
  ws.send("Hi there, I am a WebSocket server");

  ws.on("message", data => {
    const parsedMessage = parseMsg(data.toString());
    if (parsedMessage === 'connect_to_channel') {
        sub.subscribe('nice_channel');
        ws.send('Okay, connecting to nice channel');
    } else if (parsedMessage.startsWith('send_message')) {
      pub.publish('nice_channel', parsedMessage);
    }
    else {
      ws.send ('No idea what you are talking about');
    }
  });

  // Client -> WS "Parsea" -> Redis
  // Redis -> publica nos canais
  // Redis -> Websocket -> Client

  sub.on("message", handleMessage(ws));
});

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
