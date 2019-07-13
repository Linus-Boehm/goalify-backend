"use strict";

import { Router } from "express";
import { wrap } from "async-middleware";

import { isAuthenticated } from "../middlewares";
import * as controller from "../../controllers/objective_agreement";

const router = Router();

router.use(isAuthenticated);

router.get("/my", wrap(controller.listMy));
router.get("/:id", wrap(controller.show));

router.post("/", wrap(controller.create));

router.put("/:id", wrap(controller.update));

router.delete("/:id", wrap(controller.remove));


export default router;
