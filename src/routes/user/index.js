"use strict";

import { Router } from 'express';

import { isAuthenticated } from '../middlewares';
import * as controller from '../../controllers/user';

const router = Router();

router.get('/me', isAuthenticated, controller.me);
router.get('/me/organization', isAuthenticated, controller.organization);

export default router