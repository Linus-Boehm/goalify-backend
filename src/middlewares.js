"use strict";

const config = require ('./config');
const jwt = require("jsonwebtoken");

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).send(200);
    }
    else {
        next();
    }
};

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500);
    res.render('error', { error: err })
};

const isAuthenticated = (req, res, next) => {
    const header =  req.headers['authorization'];

    if (header) {
        // Remove Bearer from string
        let token = header.split(' ')[1]
        try {
            let result = jwt.verify(token, config.JwtSecret)
            req.access_token = result
            return next()

        }catch (e) {
            console.error(e)
        }
    }
    res.status(403).send("Authentication error")
}

module.exports = {
    allowCrossDomain,
    isAuthenticated,
    errorHandler
};