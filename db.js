// all of our db queries live here

var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/petition`
);

// Adds the signers to db ->

module.exports.addSignature = (signature, user_id) => {
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
module.exports.getSigners = () => {
    return db.query(`SELECT * FROM users`);
};

// Gets current signer (cookie set to that id)
module.exports.getCurrentSigner = (cookie) => {
    return db.query(`SELECT * FROM signatures WHERE id=$1`, [cookie]);
};

// Counts how many people signed ->
module.exports.countSignatures = () => {
    return db.query(`SELECT count(*) FROM users`);
};
// Adds user tu table

module.exports.createUser = (first, last, email, password) => {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) 
        RETURNING id
        `,
        [first, last, email, password]
    );
};

module.exports.getUser = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

module.exports.getIfSigned = (user_id) => {
    return db.query(`SELECT * FROM signatures WHERE user_id = $1`, [user_id]);
};
