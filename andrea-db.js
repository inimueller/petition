// this is where our database queries are going to live

var spicedPg = require("spiced-pg");

// here i tell spicedPg with which db and how to talk to it ->

var db = spicedPg("postgres:postgres:postgres:@localhost:5432/actors");

exports.getActors = () => {
    return db.query(`SELECT * FROM actors`);
};

module.exports.addActor = (name, age) => {
    return db.query(
        `
        INSERT INTO actors (name, age)
        VALUES ($1, $2)
        
        `,
        (name, age)
    );
};
