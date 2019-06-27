"use strict";

import { Router } from 'express';

import { isAuthenticated } from '../middlewares';
import * as controller from '../../controllers/goal';

const router = Router();

router.use(isAuthenticated)


export default router