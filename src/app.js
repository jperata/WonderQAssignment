import express from "express";
import bodyParser from "body-parser";
import { Queue } from "./queue";

export const app = express();

const queue = new Queue();

queue.startUnlockProcessInterval();

app.use(bodyParser.json());

app.post('/publish', function (req, res) {
    const payload = req.body.payload;
    if (!payload) {
        res.status(400).send("Payload was not found");
        return;
    }
    const message = queue.publish(payload);
    res.send(message.id);
});

app.get('/poll', function (req, res) {
    const messages = queue.poll();
    res.send(messages);
});

app.get('/process/:id', function (req, res) {
    const id = req.params.id;
    if (!id) {
        res.status(400).send("Id is required to process");
        return;
    }
    try {
        const message = queue.process(id);
        res.status(204).send();
    } catch (e) {
        if (e.message === "Message not found") {
            res.status(404).send("A message locked with the provided id was not found");
            return;
        }
        res.status(500).send(e);
    }
});

