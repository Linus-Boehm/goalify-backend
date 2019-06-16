"use strict";

const express        = require('express');
const router         = express.Router();

const {isAuthenticated}    = require('../middlewares');
const TeamController = require('../controllers/team');
const {check, oneOf} = require('express-validator/check');
const TeamMember = require('./teamMember')

router.use(isAuthenticated)
router.get('/' , TeamController.list);
router.post('/' , TeamController.create);
router.put('/:id' , TeamController.update);
router.delete('/:id' , TeamController.remove);
router.get('/:id' , TeamController.show);

router.use("/:id/member", TeamMember)


/*
router.get('/me', middlewares.checkAuthentication , AuthController.me);
router.get('/logout', middlewares.checkAuthentication, AuthController.logout);
 */
module.exports = router;