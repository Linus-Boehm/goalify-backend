"use strict";

import { Router } from "express";
import { wrap } from "async-middleware";

import { isAuthenticated } from "../middlewares";
import * as controller from "../../controllers/comment";

const router = Router();

router.use(isAuthenticated);

router.get("/:related_to", wrap(controller.listComments));

router.post("/", wrap(controller.create));

export default router;
