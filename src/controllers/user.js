"use strict";

import UserModel from "../models/user";
import OrganizationModel from "../models/organization";
import { validationResult } from "express-validator/check";

export async function organization(req, res) {
  let orga = await OrganizationModel.findById(
    req.access_token.organization_id
  ).exec();
  if (!orga)
    return res.status(404).json({
      error: "Not Found",
      message: `Organization not found`
    });
  res.status(200).json(orga);
}

export async function me(req, res) {
  let user = await UserModel.findById(req.access_token.id).exec();

  if (!user)
    return res.status(404).json({
      error: "Not Found",
      message: `User not found`
    });
  let copy = { ...user._doc };
  delete copy.password;
  res.status(200).json(copy);
}

export async function show(req, res) {
  let user = await UserModel.findById(req.params.id).exec();
  if (!user)
    return res.status(404).json({
      message: `User not found`
    });
  res.status(200).json(user);
}
export async function list(req, res) {
  let users = await UserModel.find({
    organization_id: req.access_token.organization_id
  }).exec();
  if (!users)
    return res.status(404).json({
      message: `Users not found`
    });
  res.status(200).json(users);
}
export async function remove(req, res) {
  console.log(req.body);
  let user = await UserModel.deleteOne({ _id: req.params.id }).exec();
  console.log(user);
  res.status(200).json(user);
}

export async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const user = req.body;

  try {
    let userObj = await UserModel.create(user);
    // if user is registered without errors
    // create a token

    res.status(200).json({ user: userObj });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({
        error: "User already exists",
        message: error.message
      });
    } else {
      throw error;
    }
  }
}
