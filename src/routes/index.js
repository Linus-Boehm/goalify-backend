"use strict";

import { Router } from 'express';

import userRouter from './user'
import teamRouter from './team'
import authRouter from './auth'
import goalRouter from './goal'

const router = Router();

// API routes
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/teams', teamRouter);
router.use('/goals', goalRouter);


export default router;
