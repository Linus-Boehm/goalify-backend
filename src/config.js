"use strict";



//Configuration variables

const port      = process.env.API_PORT;
const mongoURI  = process.env.MONGODB_URI;
const JwtSecret = process.env.JWT_SECRET;
console.log(mongoURI)
module.exports = {
    port,
    mongoURI,
    JwtSecret,
};