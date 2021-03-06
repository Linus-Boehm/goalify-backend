"use strict";

import UserModel from "../models/user";
import TeamModel from "../models/team";
import OrganizationModel from "../models/organization";
import { validationResult } from "express-validator/check";
import {createResetToken} from "../services/auth/token";
import {inviteUser} from "../services/email/email";

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
    return res.status(403).json({
      error: "Not Found",
      message: `User not found`
    });
  let teams = await user.loadTeams()
  let copy = { ...user._doc };
  delete copy.password;

  res.status(200).json({ user: copy, teams });
}

export async function teams(req, res) {
  let teams = await TeamModel.find({ team_roles: { $elemMatch: { user_id: req.access_token.id } } }).exec();

  res.status(200).json(teams);
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

export async function update(req, res) {
  console.log(req.body);
  let user = await UserModel.update(
    { _id: req.params.id },
    {
      ...req.body,
      organization_id: req.access_token.organization_id,
      _id: req.params.id
    }
  ).exec();
  console.log(user);
  res.status(200).json(user);
}

export async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let user = req.body;
  user = {
    ...user,
    password: Math.random().toString(36).substr(2, 5),
    confirmed: false,
    organization_id: req.access_token.organization_id
  };



  try {
    let userObj = await UserModel.create(user);
    // if user is registered without errors
    // create a token
    let token = createResetToken(userObj._id, userObj.password);
    inviteUser(token,userObj._doc,req.access_token.id);
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
