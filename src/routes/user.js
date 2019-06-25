"use strict";

const express        = require('express');
const router         = express.Router();

const {isAuthenticated}    = require('../middlewares');
const UserController = require('../controllers/user');
const {check, oneOf} = require('express-validator/check');



router.get('/me' , isAuthenticated, UserController.me);
router.get('/me/organization', isAuthenticated, UserController.organization);
//router.get('/:id')


/*
router.get('/me', middlewares.checkAuthentication , AuthController.me);
router.get('/logout', middlewares.checkAuthentication, AuthController.logout);
 */
module.exports = router;