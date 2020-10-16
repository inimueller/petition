/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const db = require("./andrea-db");

app.use(express.static("./public"));

app.get("/", (req, res) => {
    console.log("get request to / route happened");
});

app.get("/actors", (req, res) => {
    db.getActors()
        .then((results) => {
            //or you go { rows } instead of result
            console.log("results from getActors ", results.rows); // and delete results. in here, LIKE SO->

            //
            // .then(({ rows }) => {
            //     console.log("results from getActors ", rows);
        })
        .catch((err) => {
            console.log("err in getActors: ", err);
        });
});

// app.post("add-actor", (req, res) => {
//     db.addActor("Adam Driver", 34).then(() => {
//         console.log("yay it worked!");
//     })
//     .catch(err) => {
//         console.log('')
//     }
// });

app.listen(8080, () => console.log("Petition server is listening"));

//what does spiced-pg do?
//it comes from pg-npm (check it out)
//it workes like a translator between SQL and JS
