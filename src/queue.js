import { Message } from "./message";
import {MESSAGE_STATUS} from "./constants";
import dotenv from "dotenv";

dotenv.config();

export class Queue {
    constructor(maxTimeToProcess, intervalBetweenChecks) {
        this._queue = [];
        this._maxTimeToProcess = maxTimeToProcess || process.env.MAX_TIME_TO_PROCESS || 60000;
        this._intervalBetweenChecks = intervalBetweenChecks || process.env.INTERVAL_BETWEEN_CHECKS || 10000;
    }

    publish (payload) {
        const message = new Message(payload);
        this.queue.push(message);
        return message;
    }

    poll () {
        const messages = [];
        this.queue.forEach((message) => {
            if (message.status === MESSAGE_STATUS.UNLOCKED) {
                message.lock();
                messages.push({
                    id: message.id,
                    payload: message.payload,
                });
            }
        });
        return messages;
    }

    process (id) {
        const index = this.queue.findIndex(message => message.status === MESSAGE_STATUS.LOCKED && message.id === id);
        if (index === -1) {
            throw new Error("Message not found");
        }
        this.queue.splice(index, 1);
    }

    unlockUnprocessedMessages() {
        const now = new Date();
        this.queue.forEach(message => {
            if (message.status === MESSAGE_STATUS.LOCKED
                && (now.getTime() - message.lockTime.getTime() > this.maxTimeToProcess)) {
                message.unlock();
            }
        });
    }

    startUnlockProcessInterval() {
        this._interval_pid = setInterval(() => this.unlockUnprocessedMessages(), this.intervalBetweenChecks);
    }

    stopUnlockProcessInterval() {
        clearInterval(this._interval_pid);
    }

    get queue() {
        return this._queue;
    }

    get maxTimeToProcess() {
        return this._maxTimeToProcess
    }

    get intervalBetweenChecks() {
        return this._intervalBetweenChecks;
    }
}


