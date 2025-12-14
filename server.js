import http from "http";
import { WebSocketServer } from "ws";
import fs from "fs";
import path from "path";

const server = http.createServer((req, res) => {
    if (req.url === "/favicon.ico") {
        res.writeHead(204);
        res.end();
        return;
    }

    const filePath = path.join(
        process.cwd(),
        "public",
        req.url === "/" ? "index.html" : req.url
    );

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }

        let type = "text/html";
        if (filePath.endsWith(".css")) type = "text/css";
        if (filePath.endsWith(".js")) type = "application/javascript";

        res.writeHead(200, { "Content-Type": type });
        res.end(data);
    });
});

const wss = new WebSocketServer({ server });

let currentTemp = Math.floor(Math.random() * 81) - 20;

function nextTemp() {
    const delta = Math.floor(Math.random() * 7) - 3;
    currentTemp += delta;

    if (currentTemp > 60) currentTemp = 60;
    if (currentTemp < -20) currentTemp = -20;

    return currentTemp;
}

function randomDelay() {
    return 2000 + Math.random() * 3000;
}

function broadcastTemp() {
    const data = {
        type: "temperature",
        value: nextTemp(),
        time: new Date().toLocaleTimeString()
    };

    console.log("Send:", data.value);

    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    });

    setTimeout(broadcastTemp, randomDelay());
}

wss.on("connection", () => {
    console.log("Client connected");
});

broadcastTemp();

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
