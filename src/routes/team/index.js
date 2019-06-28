"use strict";

import { Router } from 'express';
import { wrap } from 'async-middleware';

import { isAuthenticated } from '../middlewares';
import * as controller from '../../controllers/team';
import memberRouter from './member'

const router = Router();

router.use(isAuthenticated)


router.get('/', wrap(controller.list));
router.get('/:id', wrap(controller.show));

router.post('/', wrap(controller.create));

router.put('/:id', wrap(controller.update));

router.delete('/:id', wrap(controller.remove));


router.use("/:id/member", memberRouter);

export default router