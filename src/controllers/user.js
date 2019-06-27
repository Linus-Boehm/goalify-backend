"use strict";

import UserModel from '../models/user'
import OrganizationModel from '../models/organization';

export async function organization(req, res) {
  try {
    let orga = await OrganizationModel.findById(req.access_token.organization_id).exec()
    if (!orga) return res.status(404).json({
      error: 'Not Found',
      message: `Organization not found`
    });
    res.status(200).json(orga)
  } catch (e) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

export async function me(req, res) {
  try {
    let user = await UserModel.findById(req.access_token.id).exec()


    if (!user) return res.status(404).json({
      error: 'Not Found',
      message: `User not found`
    });
    let copy = { ...user._doc }
    delete copy.password_hash
    res.status(200).json(copy)


  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
};
