"use strict";

import ObjectiveAgreementModel from "../models/objective_agreement";
import GoalModel from "../models/goal";

import UserModel from "../models/user";
import CommentModel from "../models/comment";

async function createUserInitatedFeedItem(agreementItem, userId, text) {

  const user = await UserModel.findOne({ _id: userId }).exec();

  const comment = {
    date: new Date(),
    related_to: agreementItem,
    related_model: 'ObjectiveAgreement',
    comment_type: 'feed_comment',
    text: `${user.firstname} ${user.lastname} ${text}`
  };


  return CommentModel.create(comment);
}

export async function listMy(req, res) {
  const userId = req.access_token.id;

  let agreements = await ObjectiveAgreementModel.find({
    $or: [ { assignee: userId }, { reviewer: userId } ]
  }).exec();

  agreements = agreements.map(a => {
    return {
      ...a._doc,
      bonus: parseFloat(a.bonus),
      max_bonus: parseFloat(a.max_bonus)
    }
  });


  res.status(200).json(agreements);
}

export async function show(req, res) {
  const userId = req.access_token.id;

  let agreement = await ObjectiveAgreementModel.findById(
    req.params.id
  ).exec();
  if (!agreement)
    return res.status(404).json({
      message: `Objective Agreement not found`
    });

  if (agreement.assignee !== userId && agreement.reviewer !== userId)
    return res.status(403).json({
      message: `Unauthorized - Not access to Objective Agreement`
    });
  agreement = {
    ...agreement._doc,
    bonus: parseFloat(agreement.bonus),
    max_bonus: parseFloat(agreement.max_bonus)
  }

  res.status(200).json(agreement);
}

export async function create(req, res) {

  const userId = req.access_token.id;

  let agreement = await ObjectiveAgreementModel.create({
    ...req.body,
    organization: req.access_token.organization_id
  });
  console.log(agreement);
  agreement = {
    ...agreement._doc,
    bonus: parseFloat(agreement.bonus),
    max_bonus: parseFloat(agreement.max_bonus)
  }

  await createUserInitatedFeedItem(agreement._id, userId, 'created the agreement')

  res.status(200).json(agreement);
}

export async function update(req, res) {
  const userId = req.access_token.id;

  let oldAgreement = await ObjectiveAgreementModel.findOne({ _id: req.params.id }).exec();

  let agreement = await ObjectiveAgreementModel.findOneAndUpdate(
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

  agreement = {
    ...agreement._doc,
    bonus: parseFloat(agreement.bonus),
    max_bonus: parseFloat(agreement.max_bonus)
  };

  if (oldAgreement.reviewer_confirmed !== agreement.reviewer_confirmed ||
    oldAgreement.assignee_confirmed !== agreement.assignee_confirmed) {

    let action = '';
    if (agreement.reviewer === userId && agreement.reviewer_confirmed ||
      agreement.assignee === userId && agreement.assignee_confirmed) {
      action = 'confirmed'
    } else {
      action = 'unconfirmed'
    }

    let status = "";
    if (agreement.reviewer_confirmed && agreement.assignee_confirmed) {
      status = 'running'
    } else if (!agreement.reviewer_confirmed && !agreement.assignee_confirmed) {
      status = 'open'
    } else {
      status = 'open Confirmation'
    }

    createUserInitatedFeedItem(agreement._id, userId, action + ' the agreement, latest status: "' + status + '"')
  }

  res.status(200).json(agreement);
}

export async function remove(req, res) {
  const userId = req.access_token.id;

  let agreement = await ObjectiveAgreementModel.findById(
    req.params.id
  ).exec();
  if (!agreement)
    return res.status(404).json({
      message: `Objective Agreement not found`
    });

  if (agreement.assignee !== userId && agreement.reviewer !== userId)
    return res.status(403).json({
      message: `Unauthorized - Not access to Objective Agreement`
    });

  await ObjectiveAgreementModel.deleteOne({ _id: agreement._id });
  agreement = {
    ...agreement._doc,
    bonus: parseFloat(agreement.bonus),
    max_bonus: parseFloat(agreement.max_bonus)
  }

  await GoalModel.remove({ related_to: agreement._id })

  res.status(200).json(agreement);
}
