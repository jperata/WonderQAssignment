import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.post('/publish', function (req, res) {
    res.send("publish");
});

app.get('/poll', function (req, res) {
    res.send('polled');
});

app.listen(PORT, function () {
    console.log("Listening on : ", PORT);
});
