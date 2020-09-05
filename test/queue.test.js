import { Queue } from "../src/queue";
import { validate as validateUUID } from 'uuid';

test("Publish a message and get the created message", () => {
    const queue = new Queue();
    const message = queue.publish({
        message: "My payload",
    });

    expect(validateUUID(message.id)).toBe(true);
    expect(message.payload.message).toBe("My payload");
    expect(queue.queue.length).toBe(1);
});