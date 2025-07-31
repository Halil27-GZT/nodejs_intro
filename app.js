// app.js - Version 4: GET /posts/:id

import http from 'http';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));

const { port, hostname } = config;

let posts = [
    { id: 1, title: 'Mein erster Blogbeitrag', content: 'Das ist der Inhalt meines ersten Beitrags. Willkommen in der Welt von Node.js!', author: 'Alice', date: '2024-07-29' },
    { id: 2, title: 'Node.js Grundlagen verstehen', content: 'Heute lernen wir die Event Loop und asynchrone Programmierung kennen.', author: 'Bob', date: '2024-07-28' }
];
let nextId = 3;

const server = http.createServer((req, res) => {
    console.log(`Anfrage erhalten: ${req.method} ${req.url}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/posts' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(posts));
    } else if (req.url.match(/^\/posts\/(\d+)$/) && req.method === 'GET') {
        const id = parseInt(req.url.split('/')[2]);
        const post = posts.find(p => p.id === id);

        if (post) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(post));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Blogbeitrag nicht gefunden' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpunkt nicht gefunden' }));
    }
});

server.listen(port, hostname, () => {
    console.log(`Server läuft unter http://${hostname}:${port}/`);
    console.log(`Testen Sie: GET http://${hostname}:${port}/posts`);
    console.log(`Testen Sie: GET http://${hostname}:${port}/posts/1`);
    console.log(`Testen Sie: GET http://${hostname}:${port}/posts/99 (für 404 Fehler)`);
});
