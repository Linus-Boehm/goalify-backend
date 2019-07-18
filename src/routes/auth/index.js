"use strict";

import { Router } from 'express';
import { wrap } from 'async-middleware';

import { check, oneOf } from 'express-validator/check';

import * as controller from '../../controllers/auth';

// ---
// <Validators>

const registerValidators = [
  check('password').isLength({ min: 8 }).withMessage('Password must have at least 8 characters')
  /*.matches('[0-9]').withMessage('Password must have 1 number')
  .matches('[a-z]').withMessage('Password must have 1 lowercase letter')
  .matches('[A-Z]').withMessage('Password must have 1 uppercase letter').custom((value, { req, loc, path }) => {
})*/,
  check("email").isEmail().withMessage('Email is invalid'),
  oneOf([ check("organization_id").exists(), check("organization_name").exists() ])
];

const loginValidators = [
  // check('password').isLength({ min: 8 }).withMessage('Min. 8 chars'),
  check("email").isEmail().withMessage('Email seems not to be valid')
];

// </Validators>
// ---

const router = Router();

router.get('/logout', wrap(controller.logout));

router.post('/login', loginValidators, wrap(controller.login));
router.post('/register', registerValidators, wrap(controller.register));

export default router