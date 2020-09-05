import { Message } from "./message";

export class Queue {
    constructor() {
        this._queue = [];
    }

    publish (payload) {
        const message = new Message(payload);
        this._queue.push(message);
        return message;
    }

    get queue() {
        return this._queue;
    }
}


