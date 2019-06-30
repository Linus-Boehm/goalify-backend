"use strict";

import { validationResult } from "express-validator/check";

import UserModel from '../models/user'
import OrganizationModel from '../models/organization';
import * as TokenService from '../services/auth/token'

export async function login(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).exec();
  if (!user || !user._id) {
    return res.status(404).json({
      error: 'User Not Found'
    })
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).send({ token: null });
  }

  const token = TokenService.signToken(user);

  res.status(200).json({
    token,
    user
  });
}


export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const user = req.body;
  try {
    if (!user.organization_id) {
      const org = await OrganizationModel.create({ name: user.organization_name })
      user.organization_id = org._id;
      user.role = "organization_admin"
    }else if(user.organization_id !== req.access_token.organization_id){
      res.status(422).json({
        error: 'Invalid organization ID'
      })
    }


    let userObj = await UserModel.create(user);
    // if user is registered without errors
    // create a token


    res.status(200).json({ user: userObj });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({
        error: 'User already exists',
        message: error.message
      })
    } else {
      throw error
    }
  }
}

export function logout(req, res) {
  res.status(200).send({ token: null });
}