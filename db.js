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
    return db.query(`SELECT * FROM signatures WHERE user_id=$1`, [cookie]);
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

//  Checks if there is already a user with this email

module.exports.getUser = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

// Checks if the user already signed

module.exports.getIfSigned = (user_id) => {
    return db.query(`SELECT * FROM signatures WHERE user_id = $1`, [user_id]);
};

// Adds info to the user's profile

module.exports.addInfo = (age, city, url, user_id) => {
    console.log(age, city, url, user_id);
    return db.query(
        `
        INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `,
        [age || null, city, url, user_id]
        // ivana explained that using || avoids the err on age being negative or null
    );
};

////////////////////// JOINING TABLES //////////////////////

// 1. we need signatures because it will tell us whether or not the user signed the petition
// 2. we need users to get the user's first and last name
// 3. we need user_profiles to get the signers age, city, and url (if they provided any)

module.exports.getSigners = () => {
    return db.query(`
    SELECT signatures.signature, users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url 
    FROM signatures
    JOIN users
    ON users.id = signatures.user_id
    JOIN user_profiles
    ON users.id = user_profiles.user_id;
    `);
};

module.exports.getProfile = (user_id) => {
    return db.query(
        `
    SELECT users.first, users.last, users.email, user_profiles.age, user_profiles.city, user_profiles.url
    FROM users
    JOIN user_profiles
    ON users.id = user_profiles.user_id 
    WHERE user_id=$1   
    `,
        [user_id]
    );
};

module.exports.getSignersByCity = (city) => {
    return db.query(
        `
    SELECT signatures.signature, users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url 
    FROM signatures
    JOIN users
    ON users.id = signatures.user_id
    JOIN user_profiles
    ON users.id = user_profiles.user_id 
    WHERE city = $1 
    `,
        [city]
    );
};

module.exports.updateUserPassword = (first, last, email, password, id) => {
    return db.query(
        `
        UPDATE users 
        SET first = $1, last=$2, email=$3, password= $4
        WHERE id = $5
        RETURNING *;
        `,
        [first, last, email, password, id]
    );
};

module.exports.updateUserNoPassword = (first, last, email, id) => {
    return db.query(
        `
        UPDATE users 
        SET first = $1, last=$2, email=$3
        WHERE id = $4
        RETURNING *;
        `,
        [first, last, email, id]
    );
};

module.exports.updateProfile = (age, city, url, user_id) => {
    return db.query(
        `

        INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age = $1, city = $2, url =$3
        RETURNING *
        `,
        [age || null, city, url, user_id]
    );
};

module.exports.deleteSignature = (user_id) => {
    return db.query(
        `
                DELETE FROM signatures WHERE user_id=$1
        `,
        [user_id]
    );
};
