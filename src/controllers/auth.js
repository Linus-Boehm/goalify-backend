"use strict";

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config');
const UserModel = require('../models/user');
const OrganizationModel = require('../models/organization');
const {validationResult} = require('express-validator/check');
const uuidv4 = require('uuid/v4');

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    try {
        let user = await UserModel.findOne({email: req.body.email}).exec()

        // check if the password is valid

        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password_hash);
        if (!isPasswordValid) return res.status(401).send({token: null});

        // if user is found and password is valid
        // create a token
        const token = jwt.sign({id: user._id, email: user.email, organization_id: user.organization_id, role: user.role}, config.JwtSecret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).json({token: token, user});

    } catch (e) {
        console.error(e)
        return res.status(404).json({
            error: 'User Not Found',
            message: e.message
        })
    }

};


const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    if (req.body.organization_name) {
        let org = await OrganizationModel.create({name: req.body.organization_name})
        req.body.organization_id = org._id;
        req.body.role = "organization_admin"
    }


    const userObj = Object.assign(req.body, {password_hash: bcrypt.hashSync(req.body.password, 8)});
    try {
        let user = await UserModel.create(userObj)
        // if user is registered without errors
        // create a token


        res.status(200).json({user: user});
    } catch (error) {
        if (error.code == 11000) {
            res.status(400).json({
                error: 'User exists',
                message: error.message
            })
        } else {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        }
    }


};

const logout = (req, res) => {
    res.status(200).send({token: null});
};


module.exports = {
    login,
    register,
    logout
};