"use strict";

import { Router } from 'express';

import { isAuthenticated } from '../middlewares';
import * as controller from '../../controllers/team';
import memberRouter from './member'

const router = Router();

router.use(isAuthenticated)


router.get('/', controller.list);
router.get('/:id', controller.show);

router.post('/', controller.create);

router.put('/:id', controller.update);

router.delete('/:id', controller.remove);


router.use("/:id/member", memberRouter);

export default router