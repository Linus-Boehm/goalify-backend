"use strict";

import TeamModel from '../models/team';

export async function list(req, res) {
  let teams = await TeamModel.find({ organization_id: req.access_token.organization_id }).exec()
  if (!teams)
    return res.status(404).json({
      message: `Teams not found`
    });

  res.status(200).json(teams)
}

export async function show(req, res) {

}

export async function create(req, res) {
  try {
    let team = await TeamModel.create({ ...req.body, organization_id: req.access_token.organization_id })
    res.status(200).json(team)
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }

}

export async function update(req, res) {

}

export async function remove(req, res) {

}