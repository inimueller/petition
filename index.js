/////ROUTES live here (4.)////
// index.js structure
// 1. variable declarations + requiring
// 2. middleware
// 3. routes
// 4. port listener

/////////////variables/////////////

const express = require("express");
const app = express();
const db = require("./db");
const handlebars = require("express-handlebars");
const cookieSession = require("cookie-session");

/////////////middleware/////////////

app.use(
    cookieSession({
        secret: `I'm always hungry`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

/////////////routes/////////////
// 1. "/" redirects to petition

app.get("/", (req, res) => {
    res.redirect("/petition");
    console.log("get request to / route happened");
});

//// go get the petition html <---

app.get("/petition", (req, res) => {
    //if signed session "cookie" exists, redirect the user to the signed paged
    const { signed } = req.session;
    if (signed) {
        res.redirect("/signed");
    } else {
        res.render("petition", {
            layout: "main",
        });
    }
});
/////////////port listener/////////////

app.listen(8000, () => console.log("Ini's petition server up and running"));
