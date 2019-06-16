"use strict";

const express        = require('express');
const router         = express.Router();

const {isAuthenticated}    = require('../middlewares');
const TeamMember = require('../controllers/teamMember');
const {check, oneOf} = require('express-validator/check');






/*
router.get('/me', middlewares.checkAuthentication , AuthController.me);
router.get('/logout', middlewares.checkAuthentication, AuthController.logout);
 */
module.exports = router;