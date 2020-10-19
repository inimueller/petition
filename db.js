// all of our db queries live here

var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

// Adds the signers to db ->

exports.addSignature = (first, last, signature) => {
    // console.log(firstname, lastname, signature);
    return db.query(
        `
        INSERT INTO signatures (first, last, signature)
        VALUES ($1, $2, $3) 
        RETURNING id
        `,
        [first, last, signature]

        //to avoid sql injections!
    );
};

// Gets the list of people who already signed ->
exports.getSigners = () => {
    return db.query(`SELECT * FROM signatures`);
};

// Gets current signer (cookie set to that id)
module.exports.getCurrentSigner = (cookie) => {
    return db.query(`SELECT * FROM signatures WHERE id=${cookie}`);
};

// Counts how many people signed ->
exports.countSignatures = () => {
    return db.query(`SELECT count(*) FROM signatures`);
};
