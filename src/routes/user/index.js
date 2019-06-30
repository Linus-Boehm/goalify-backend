"use strict";

import { Router } from "express";
import { wrap } from "async-middleware";

import { isAuthenticated } from "../middlewares";
import * as controller from "../../controllers/user";

const router = Router();

router.use(isAuthenticated);

router.get("/me", isAuthenticated, wrap(controller.me));
router.get("/me/organization", isAuthenticated, wrap(controller.organization));

router.get("/", wrap(controller.list));
router.get("/:id", wrap(controller.show));
router.delete("/:id", wrap(controller.remove));
router.post("/create", wrap(controller.create));

export default router;
