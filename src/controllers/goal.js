"use strict";

import TeamModel from '../models/team';
import GoalModel from '../models/goal';
import ObjectiveAgreementModel from '../models/objective_agreement';
import * as EmailService from '../services/email/email'
import CommentModel from "../models/comment";
import UserModel from "../models/user";

function genArchivedAtQuery(isArchived) {
  // $exists: existance of field is null, if field is null the field exists
  // null: field does not exist OR field is null
  return isArchived ? { $exists: true } : null;
}

export const assingeePopulateConfig = {
  path: "assignee",
  select: "firstname lastname email"
};


async function createUserInitatedFeedItem(goalId, userId, text) {

  const user = await UserModel.findOne({ _id: userId }).exec();

  const comment = {
    date: new Date(),
    related_to: goalId,
    related_model: 'Goal',
    comment_type: 'feed_comment',
    text: `${user.firstname} ${user.lastname} ${text}`
  };

  console.log(comment);


  return await CommentModel.create(comment);
}

export async function show(req, res) {
  const userId = req.access_token.id;
  const organizationId = req.access_token.organization_id;

  let goal = await GoalModel.findById(req.params.id)
    .populate(assingeePopulateConfig)
    .exec();

  if (!goal || goal.deleted_at)
    return res.status(404).json({
      message: `Goal not found`
    });

  if (goal.organization_id !== organizationId)
    return res.status(403).json({
      message: `Unauthorized - Goal is not in user's organization`
    });

  if (goal.is_private && goal.created_by !== userId)
    return res.status(403).json({
      message: `Unauthorized - Goal is private`
    });

  res.status(200).json(goal);
}

export async function listMyGoals(req, res) {
  const isArchived = !!req.query.is_archived;

  const userId = req.access_token.id;
  if (!userId) {
    return res.status(400).json({
      message: `user_id in access_token is null`
    });
  }

  const goals = await GoalModel
    .find({
      assignee: userId,

      archived_at: genArchivedAtQuery(isArchived),
      deleted_at: null,
    })
    .populate(assingeePopulateConfig)
    .exec();

  res.status(200).json(goals);
}

export async function listAgreementGoals(req, res) {
  const isArchived = !!req.query.is_archived;

  const userId = req.access_token.id;

  const agreementId = req.params.agreement_id;
  const agreement = await ObjectiveAgreementModel.findById(agreementId).exec()
  if (!agreement || !agreement._id) {
    return res.status(404).json({
      message: `Objective Agreement with Id ${agreementId} not found`
    });
  }

  if (userId !== agreement.assignee && userId !== agreement.reviewer) {
    return res.status(403).json({
      message: `User has no access to Agreement ${agreement._id}`
    });
  }

  const goals = await GoalModel.find({
    related_to: agreement._id,
    archived_at: genArchivedAtQuery(isArchived),
    deleted_at: null
  })
    .populate(assingeePopulateConfig)
    .exec()

  res.status(200).json(goals)
}


export async function listTeamGoals(req, res) {
  const isArchived = !!req.query.is_archived;

  const teamId = req.params.team_id;

  const userId = req.access_token.id;
  if (!userId) {
    return res.status(400).json({
      message: `user_id in access_token is null`
    });
  }

  const team = await TeamModel.findById(teamId).exec();
  if (!team || !team._id) {
    return res.status(404).json({
      message: `Team with Id ${teamId} not found`
    });
  }

  const role = team.getTeamRole({ user_id: userId });
  if (!role) {
    return res.status(403).json({
      message: `User has no access to Team ${team._id}`
    });
  }

  const goals = await GoalModel.find({
    related_to: team._id,
    archived_at: genArchivedAtQuery(isArchived),
    deleted_at: null
  })
    .populate(assingeePopulateConfig)
    .exec();

  res.status(200).json(goals);
}

export async function listOrganizationGoals(req, res) {
  const isArchived = !!req.query.is_archived;

  const organizationId = req.access_token.organization_id;
  if (!organizationId) {
    return res.status(400).json({
      message: `organization_id in access_token is null`
    });
  }

  const goals = await GoalModel.find({
    related_to: organizationId,
    archived_at: genArchivedAtQuery(isArchived),
    deleted_at: null
  })
    .populate(assingeePopulateConfig)
    .exec();

  res.status(200).json(goals);
}

export async function create(req, res) {
  const userId = req.access_token.id;
  const organizationId = req.access_token.organization_id;
  if (!organizationId) {
    return res.status(400).json({
      message: `organization_id in access_token is null`
    });
  }

  let goal = await GoalModel.create({
    title: "New Goal",
    ...req.body,

    created_by: userId,
    organization_id: organizationId
  });

  goal = await goal.populate(assingeePopulateConfig).execPopulate();

  await createUserInitatedFeedItem(goal._id, userId, 'created the goal');

  res.status(200).json(goal);
}

export async function update(req, res) {
  const userId = req.access_token.id;
  const { id } = req.params;

  const updatedData = req.body;

  delete updatedData._id;
  delete updatedData.organization_id;
  delete updatedData.created_by;

  let oldGoal = await GoalModel.findOne({ _id: id }).exec();

  let goal = await GoalModel.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
    useFindAndModify: false
  })
    .populate(assingeePopulateConfig)
    .exec();

  if (!goal) {
    return res.status(404).json({
      message: `Could not find goal with id ${id}`
    });
  }

  if(updatedData.notifyReviewer && goal.related_model === "ObjectiveAgreement") {
    const agreement = await ObjectiveAgreementModel.findOne({ _id: goal.related_to });
    EmailService.sendProgressToReviewGoalMail(goal, agreement.reviewer);
  }

  if (goal.title && oldGoal.title !== goal.title) {
    createUserInitatedFeedItem(goal._id, userId, 'updated the title to "' + goal.title + '"');
  } else if (goal.description && oldGoal.description !== goal.description) {
    createUserInitatedFeedItem(goal._id, userId, 'updated the description');
  } else if (goal.oa_weight && oldGoal.oa_weight !== goal.oa_weight) {
    createUserInitatedFeedItem(goal._id, userId, 'updated the bonus weight to: ' + goal.oa_weight);
  }

  if (req.access_token.id !== goal.assignee && goal.reviewer) {
    EmailService.sendUpdateAgreementGoalEmail(goal, goal.assignee)
  }

  res.status(200).json(goal);
}