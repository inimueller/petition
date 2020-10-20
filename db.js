// all of our db queries live here

var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

// Adds the signers to db ->

exports.addSignature = (signature, user_id) => {
    // console.log(firstname, lastname, signature);
    return db.query(
        `
        INSERT INTO signatures (signature, user_id)
        VALUES ($1, $2) 
        RETURNING id
        `,
        [signature, user_id]

        //to avoid sql injections!
    );
};

// Gets the list of people who already signed ->
exports.getSigners = () => {
    return db.query(`SELECT * FROM users`);
};

// Gets current signer (cookie set to that id)
module.exports.getCurrentSigner = (cookie) => {
    return db.query(`SELECT * FROM signatures WHERE id=${cookie}`);
};

// Counts how many people signed ->
exports.countSignatures = () => {
    return db.query(`SELECT count(*) FROM users`);
};
// Adds user tu table

exports.createUser = (first, last, email, password) => {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) 
        RETURNING id
        `,
        [first, last, email, password]
    );
};

exports.getUser = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};
