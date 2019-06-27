"use strict";

import { Router } from 'express';
import { wrap } from 'async-middleware';

import { isAuthenticated } from '../middlewares';
import * as controller from '../../controllers/goal';

const router = Router();

router.use(isAuthenticated)
router.get('/assigned', wrap(controller.listAssignedToMe))
router.get('/teams', wrap(controller.listTeamGoals))

export default router