const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let queue = [];

// Join queue
app.post("/join", (req, res) => {
    const user = {
        id: Date.now(),
        name: req.body.name
    };
    queue.push(user);
    res.json({ position: queue.length });
});

// Get queue
app.get("/queue", (req, res) => {
    res.json(queue);
});

// Next person
app.post("/next", (req, res) => {
    if (queue.length > 0) {
        queue.shift();
    }
    res.json(queue);
});

app.listen(3000, () => console.log("Server running on port 3000"));