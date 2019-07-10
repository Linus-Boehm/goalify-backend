"use strict";

import TeamModel from '../models/team';
import GoalModel from '../models/goal';
import ObjectiveAgreementModel from '../models/objective_agreement';


function genArchivedAtQuery(isArchived) {
  // $exists: existance of field is null, if field is null the field exists
  // null: field does not exist OR field is null
  return isArchived ? { $exists: true } : null;
}

export const assingeePopulateConfig = { path: 'assignee', select: 'firstname lastname' }

export async function show(req, res) {
  const userId = req.access_token.id;
  const organizationId = req.access_token.organization_id;

  let goal = await GoalModel
    .findById(req.params.id)
    .populate(assingeePopulateConfig)
    .exec()

  if (!goal || goal.deleted_at)
    return res.status(404).json({
      message: `Goal not found`
    });

  if (goal.organization_id !== organizationId)
    return res.status(403).json({
      message: `Unauthorized - Goal is not in user's organization`
    })

  if (goal.is_private && goal.created_by !== userId)
    return res.status(403).json({
      message: `Unauthorized - Goal is private`
    })

  res.status(200).json(goal)
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
      related_to: null,

      archived_at: genArchivedAtQuery(isArchived),
      deleted_at: null,
    })
    .populate(assingeePopulateConfig)
    .exec();


  res.status(200).json(goals)
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

  const team = await TeamModel.findById(teamId).exec()
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
    .exec()

  res.status(200).json(goals)
}

export async function listOrganizationGoals(req, res) {
  const isArchived = !!req.query.is_archived;

  const organizationId = req.access_token.organization_id;
  if (!organizationId) {
    return res.status(400).json({
      message: `organization_id in access_token is null`
    });
  }

  const goals = await GoalModel
    .find({
      related_to: organizationId,
      archived_at: genArchivedAtQuery(isArchived),
      deleted_at: null
    })
    .populate(assingeePopulateConfig)
    .exec();

  res.status(200).json(goals)
}

export async function create(req, res) {
  const userId = req.access_token.id;
  const organizationId = req.access_token.organization_id;
  if (!organizationId) {
    return res.status(400).json({
      message: `organization_id in access_token is null`
    });
  }

  console.log(req.body);

  let goal = await GoalModel.create({
    title: 'New Goal',
    ...req.body,

    created_by: userId,
    organization_id: organizationId
  });

  goal = await goal.populate(assingeePopulateConfig).execPopulate();


  res.status(200).json(goal);
}

export async function update(req, res) {

  const { id } = req.params;

  const updatedData = req.body;

  delete updatedData._id;
  delete updatedData.organization_id;
  delete updatedData.created_by;

  let goal = await GoalModel
    .findOneAndUpdate(
      { _id: id },
      updatedData,
      { new: true, useFindAndModify: false })
    .populate(assingeePopulateConfig)
    .exec();

  if (!goal) {
    return res.status(404).json({
      message: `Could not find goal with id ${id}`
    });
  }

  res.status(200).json(goal)
}
