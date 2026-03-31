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
        name: req.body.name,
        lastActive: Date.now()
    };
    queue.push(user);
    res.json({ position: queue.length,id: user.id });
});

// Update activity (heartbeat)
app.post("/active", (req, res) => {
    const id = req.body.id;
    queue = queue.map(u => {
        if (u.id === id) {
            u.lastActive = Date.now();
        }
        return u;
    });
    res.json({ message: "updated" });
});

// Get queue (remove inactive users)
app.get("/queue", (req, res) => {
    const now = Date.now();

    // remove users inactive for 10 seconds
    queue = queue.filter(u => now - u.lastActive < 10000);

    res.json(queue);
});

// Next person
app.post("/next", (req, res) => {
    queue.shift();
    res.json(queue);
});

app.listen(3000, () => console.log("Server running on port 3000"));