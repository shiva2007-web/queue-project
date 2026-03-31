const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let queue = [];
function distance(lat1, lon1, lat2, lon2) {
    return Math.sqrt(
        Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)
    );
}
app.post("/join", (req, res) => {
    const user = {
        id: Date.now(),
        name: req.body.name,
        lat: req.body.lat,
        lon: req.body.lon,
        lastActive: Date.now()
    };
    queue.push(user);
    res.json({ position: queue.length, id: user.id });
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

app.get("/queue", (req, res) => {
    const now = Date.now();

    const CENTER_LAT = 12.9716; // set your location
    const CENTER_LON = 77.5946;

    queue = queue.filter(u => {
        const active = now - u.lastActive < 10000;
        const near = distance(u.lat, u.lon, CENTER_LAT, CENTER_LON) < 0.01;

        return active && near;
    });

    res.json(queue);
});

// Next person
app.post("/next", (req, res) => {
    queue.shift();
    res.json(queue);
});

app.listen(3000, () => console.log("Server running on port 3000"));