"use strict";

const express        = require('express');
const router         = express.Router();

const middlewares    = require('../middlewares');
const AuthController = require('../controllers/auth');
const {check} = require('express-validator/check');

let registerValidators = [
    check('password').isLength({ min:8 }).withMessage('Min. 8 chars')
        .matches('[0-9]').withMessage('Password must have 1 number')
        .matches('[a-z]').withMessage('Password must have 1 lowercase letter')
        .matches('[A-Z]').withMessage('Password must have 1 uppercase letter'),
    check("email").isEmail().withMessage('Email seems not to be valid')
]

router.post('/login', AuthController.login);
router.post('/register',registerValidators, AuthController.register);
router.get('/me' , AuthController.me);
router.get('/logout', AuthController.logout);



/*
router.get('/me', middlewares.checkAuthentication , AuthController.me);
router.get('/logout', middlewares.checkAuthentication, AuthController.logout);
 */
module.exports = router;