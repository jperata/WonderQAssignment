import { Queue } from "../src/queue";
import { validate as validateUUID } from 'uuid';

describe("Queue", () => {
    test("Publish a message and get the created message", () => {
        const queue = new Queue();
        const message = queue.publish({
            message: "My payload",
        });

        expect(validateUUID(message.id)).toBe(true);
        expect(message.payload.message).toBe("My payload");
        expect(queue.queue.length).toBe(1);
    });

    test("Publish a message and poll it", () => {
        const queue = new Queue();
        queue.publish({
            message: "My payload",
        });

        const message = queue.poll()[0];
        expect(validateUUID(message.id)).toBe(true);
        expect(message.payload.message).toBe("My payload");

        const emptyPoll = queue.poll();
        expect(emptyPoll).toHaveLength(0);
    });


    test("Validate poll locks messages correctly on concurrency", async () => {
        const queue = new Queue();
        for(let i = 0; i < 10; i++) {
            queue.publish({
                message: "Payload"
            })
        }

        const setTimeoutPromise = new Promise(resolve => {
            setImmediate(() => resolve(queue.poll()));
        });

        const setTimeoutPromise2 = new Promise(resolve => {
            setImmediate(() => resolve(queue.poll()) );
        });

        const promisesResolve = await Promise.all([setTimeoutPromise, setTimeoutPromise2]);

        const [messages1, messages2] = promisesResolve;

        expect(messages1).toBeDefined();
        expect(messages2).toBeDefined();

        expect(messages1.length + messages2.length).toBe(10);
    });

    test("Publish a message, poll it and process it", () => {
        const queue = new Queue();
        queue.publish({
            message: "My payload",
        });

        const message = queue.poll()[0];
        queue.process(message.id);
        expect(queue.queue).toHaveLength(0);
    });

    test("Process edge cases", () => {
        const queue = new Queue();
        queue.publish({
            message: "My payload",
        });

        expect(() => { queue.process("wrong id") }).toThrowError("Message not found");
        const message = queue.queue[0];
        expect(() => { queue.process(message.id) }).toThrowError("Message not found");

    });

    test("Locked messages are unlocked after enought time has passed", async () => {
        const queue = new Queue(10, 20);
        queue.startUnlockProcessInterval();
        queue.publish({
            message: "My payload",
        });

        const message = queue.poll();

        const emptyPoll = queue.poll();
        expect(emptyPoll).toHaveLength(0);

        const delayPromise = new Promise(resolve => {
            setTimeout(() => resolve(), 30);
        });

        await delayPromise;
        const pollLiberated = queue.poll();

        expect(pollLiberated).toHaveLength(1);
        queue.stopUnlockProcessInterval();
    });
});
