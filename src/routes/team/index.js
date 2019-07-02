"use strict";

import { Router } from 'express';
import { wrap } from 'async-middleware';

import { isAuthenticated } from '../middlewares';
import * as controller from '../../controllers/team';

const router = Router();

router.use(isAuthenticated)


router.get('/', wrap(controller.list));
router.get('/:id', wrap(controller.show));

router.post('/', wrap(controller.create));

router.put('/:id', wrap(controller.update));

router.delete('/:id', wrap(controller.remove));


router.put("/:id/member/", wrap(controller.updateMembers));

router.delete("/:id/member/:userId", wrap(controller.removeMembers));

export default router