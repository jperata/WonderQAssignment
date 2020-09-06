import request from "supertest";
import { app } from "../src/app";

jest.mock("../src/queue", () => {
    return {
        Queue: jest.fn().mockImplementation(() => {
            return {
                publish: function () {
                    return {
                        id: "id"
                    };
                },
                process: function (id)  {
                    if (id === "good-id") {
                        return;
                    } else {
                        throw new Error("Message not found");
                    }
                },
                poll: function () {
                    return [{
                        id: "id",
                    }];
                },
                startUnlockProcessInterval: function () {},
            }
        })
    };
});

describe("App tests", () => {
    describe("/publish", () => {
        test("Should fail when publish without payload", () => {
            return request(app)
                .post("/publish")
                .expect(400);
        });

        test("Should create element with payload", () => {
            const data = {
                payload: "message",
            };

            return request(app)
                .post("/publish")
                .send(data)
                .expect(200)

        });
    });

    describe("/poll", () => {
        test("Should return a json element for poll", () => {
            return request(app)
                .get('/poll')
                .expect('Content-Type', /json/)
                .expect(200)
        });
    });

    describe("/process", () => {
        test("Should return an empty response on success", () => {
            return request(app)
                .get('/process/good-id')
                .expect(204)
        });

        test("Should return a 404 when there is no element to process", () => {
            return request(app)
                .get('/process/id')
                .expect(404)
        });

    });
});