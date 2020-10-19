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

// 2 . if no cookie, it renders the petition handlebar
// otherwise it redirects to the signed page

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

// 3. if there is a cookie, render signers name, image of signature, the count of signers
// and the link to the signers list
// otherwise redirects to petition

app.get("/signed", (req, res) => {
    const { signed } = req.session;
    if (signed) {
        db.countSignatures().then((arg) => {
            const count = arg.rows[0].count;
            db.getCurrentSigner(signed).then(({ rows }) => {
                // console.log("rows:", rows);
                res.render("signed", {
                    rows,
                    count,
                });
            });
        });
    } else {
        res.redirect("/petition");
    }
});

// 4. if there is a cookie, it shows the list of signers, otherwise redirects to petition

app.get("/signers", (req, res) => {
    const { signed } = req.session;
    if (signed) {
        db.getSigners().then(({ rows }) => {
            res.render("signers", {
                rows,
            });
        });
    } else {
        res.redirect("/petition");
    }
});

// POST to table

app.post("/petition", (req, res) => {
    const { first, last, signature } = req.body;
    console.log(first, last, signature);
    // here I need to set a cookie to redirect the user to the signed page ??
    if (first !== "" && last !== "" && signature !== "") {
        db.addSignature(first, last, signature)
            .then((results) => {
                // console.log(results);
                req.session.signed = results.rows[0].id;
                res.redirect("/signed");
            })

            .catch((err) => {
                console.log("Error during addSignature", err);
            });
    } else {
        res.render("petition", {
            empty: true,
        });
    }
});

/////////////port listener/////////////

app.listen(8000, () => console.log("Ini's petition server up and running"));
