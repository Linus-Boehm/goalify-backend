"use strict";

import ObjectiveAgreementModel from "../models/objective_agreement";
import GoalModel from "../models/goal";
import { assingeePopulateConfig } from "./goal";

export async function listMy(req, res) {
  const userId = req.access_token.id;
  console.log(userId);

  let agreements = await ObjectiveAgreementModel.find({
    $or: [
      { assignee: userId },
      { reviewer: userId }
    ]
  }).exec();

  res.status(200).json(agreements);
}

export async function show(req, res) {
  const userId = req.access_token.id;

  const agreement = await ObjectiveAgreementModel.findById(req.params.id).exec();
  if (!agreement)
    return res.status(404).json({
      message: `Objective Agreement not found`
    });

  if (agreement.assignee !== userId && agreement.reviewer !== userId)
    return res.status(403).json({
      message: `Unauthorized - Not access to Objective Agreement`
    });

  res.status(200).json(agreement);
}

export async function create(req, res) {

  const agreement = await ObjectiveAgreementModel.create({
    ...req.body,
    organization_id: req.access_token.organization_id
  }).exec();

  res.status(200).json(agreement);
}

export async function update(req, res) {
  const agreement = await ObjectiveAgreementModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      ...req.body,
      organization_id: req.access_token.organization_id,
      _id: req.params.id
    },
    {
      new: true,
      useFindAndModify: false
    }
  ).exec();
  res.status(200).json(agreement);
}


export async function remove(req, res) {
  const agreement = await ObjectiveAgreementModel.findById(req.params.id).exec();
  if (!agreement)
    return res.status(404).json({
      message: `Objective Agreement not found`
    });

  if (agreement.assignee !== userId && agreement.reviewer !== userId)
    return res.status(403).json({
      message: `Unauthorized - Not access to Objective Agreement`
    });

  ObjectiveAgreementModel.deleteOne({ _id: agreement._id })
  res.status(200).json(agreement);
}
