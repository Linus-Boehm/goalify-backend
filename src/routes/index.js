"use strict";

import { Router } from "express";

import userRouter from "./user";
import teamRouter from "./team";
import authRouter from "./auth";
import goalRouter from "./goal";
import commentRouter from "./comment";

const router = Router();

// API routes
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/teams", teamRouter);
router.use("/goals", goalRouter);
router.use("/comments", commentRouter);

export default router;
