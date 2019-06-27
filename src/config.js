"use strict";

require('dotenv').config()

export const port = process.env.API_PORT;
export const mongoURI = process.env.MONGODB_URI;
export const JwtSecret = process.env.JWT_SECRET;

console.log(mongoURI);
