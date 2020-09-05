import { v4 as uuidv4 } from 'uuid';
import { MESSAGE_STATUS } from "./constants";

export class Message {
    constructor(payload) {
        this._id = uuidv4();
        this._payload = payload;
        this._status = MESSAGE_STATUS.UNLOCKED;
    }

    lock() {
        this._status = MESSAGE_STATUS.LOCKED;
        this._lockTime = new Date();
    }

    process() {
        this._status = MESSAGE_STATUS.PROCESSED;
    }

    unlock() {
        this._status = MESSAGE_STATUS.UNLOCKED;
        this._lockTime = undefined;
    }

    get id() {
        return this._id;
    }

    get status() {
        return this._status;
    }

    get payload() {
        return this._payload;
    }

    get lockTime() {
        return this._lockTime;
    }
}