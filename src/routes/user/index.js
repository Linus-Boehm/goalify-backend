"use strict";

import { Router } from 'express';
import { wrap } from 'async-middleware';

import { isAuthenticated } from '../middlewares';
import * as controller from '../../controllers/user';

const router = Router();

router.get('/me', isAuthenticated, wrap(controller.me));
router.get('/me/organization', isAuthenticated, wrap(controller.organization));

export default router