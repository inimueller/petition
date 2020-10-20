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
const { hash, compare } = require("./bc");
// const bcrypt = require("./bcrypt");

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
    const { user, signed } = req.session;
    if (signed) {
        res.redirect("/signed");
    } else if (user) {
        res.redirect("/petition");
    } else {
        res.redirect("/register");
    }
    // console.log("get request to / route happened");
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
    // enter the user's id into the database GET /petition HOW??? like this?
    // const { id } = req.session.user; //????
    // -----
    const { signature } = req.body;
    const { id } = req.session.user;
    console.log(id);
    // here I need to set a cookie to redirect the user to the signed page ??
    if (signature !== "") {
        db.addSignature(signature, id)
            .then((results) => {
                console.log(results);
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

// ---------> Part 3 NEW ROUTES <---------- \\

// 1. GET /

app.get("/", (req, res) => {
    res.redirect("/register");
    // console.log("get request to / route happened");
});

// 2. GET register

app.get("/register", (req, res) => {
    res.render("register");
});

// 3. GET login

app.get("/login", (req, res) => {
    res.render("login");
});

// 1. POST login

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("lol");
    if (email !== "" && password !== "") {
        db.getUser(email)
            .then((results) => {
                // console.log("from geUser > results: ", results);
                const hashedPw = results.rows[0].password;
                compare(password, hashedPw)
                    .then((match) => {
                        //if passowrd === hashedPw -> set cookie
                        if (match) {
                            req.session.user = {
                                id: results.rows[0].id,
                            };
                            res.redirect("/petition");
                        } else {
                            console.log("pass is wrong");
                            res.render("login", { fehler: "Wrong password!" });
                        }
                    })
                    .catch((err) => {
                        console.log("error in POST /login compare():", err);
                        res.render("login", { fehler: "Wrong password!" });
                    });
            })
            .catch((err) => {
                console.log("error in POST /login getUser():", err);
                res.render("login", { fehler: "Wrong password!" });
            });
    } else {
        res.render("login");
    }
});

// 2. POST register

app.post("/register", (req, res) => {
    // grab the user input and read it on the server
    // like this? ->
    const { first, last, email, password } = req.body;
    // console.log("datos ingresados: ", first, last, email, password);

    // checks that all the fields are filled
    if (
        first !== "" &&
        last !== "" &&
        email !== "" &&
        password !== ""
        // hash the passowrd that the user typed and THEN-> insert a row in the USERS table
    ) {
        // TODO Que pasa cuando el email ya esta en la DB ?
        hash(password)
            .then((hashedPw) => {
                console.log("parametros:", first, last, email, hashedPw);
                db.createUser(first, last, email, hashedPw)
                    .then((results) => {
                        console.log("insertion result: ", results.rows[0]);
                        req.session.user = { id: results.rows[0] };
                        res.redirect("./petition");
                    })
                    .catch((err) => {
                        console.log("err inserting data in the DB: ", err);
                    });
            })
            .catch((err) => {
                console.log("err hashing the ps: ", err);
            });
    }

    //add userId in a cookie (val should be the id greated by posgress)
    //if insert fails re-render template with error message
});

/////////////port listener/////////////

app.listen(8000, () => console.log("Ini's petition server up and running"));
