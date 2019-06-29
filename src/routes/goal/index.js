"use strict";

import { Router } from 'express';
import { wrap } from 'async-middleware';

import { isAuthenticated } from '../middlewares';
import * as controller from '../../controllers/goal';

const router = Router();

router.use(isAuthenticated)
router.get('/assigned', wrap(controller.listAssignedToMe))
router.get('/team', wrap(controller.listTeamGoals))
router.get('/organization', wrap(controller.listOrganizationGoals))

router.get('/:id', wrap(controller.show))

export default router