"use strict";

const express        = require('express');
const router         = express.Router();

const AuthController = require('../controllers/auth');
const {check, oneOf} = require('express-validator/check');

let registerValidators = [
    check('password').isLength({ min:8 }).withMessage('Min. 8 chars')
        .matches('[0-9]').withMessage('Password must have 1 number')
        .matches('[a-z]').withMessage('Password must have 1 lowercase letter')
        .matches('[A-Z]').withMessage('Password must have 1 uppercase letter').custom((value,{req, loc, path}) => {
        if (value !== req.body.confirm_password) {
            // trow error if passwords do not match
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    }),
    check("email").isEmail().withMessage('Email seems not to be valid'),
    oneOf([check("organization_id").exists(), check("organization_name").exists()])
];
let loginValidators = [
    check('password').isLength({ min:8 }).withMessage('Min. 8 chars'),
    check("email").isEmail().withMessage('Email seems not to be valid')
];
router.post('/login',loginValidators, AuthController.login);
router.post('/register',registerValidators, AuthController.register);
router.get('/logout', AuthController.logout);



/*
router.get('/me', middlewares.checkAuthentication , AuthController.me);
router.get('/logout', middlewares.checkAuthentication, AuthController.logout);
 */
module.exports = router;