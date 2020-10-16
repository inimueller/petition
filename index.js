const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("./public"));

app.get("/", (req, res) => {
    console.log("get request to / route happened");
});

app.listen(8000, () => console.log("Ini's petition server up and running"));
