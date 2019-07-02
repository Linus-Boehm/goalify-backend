"use strict";

import TeamModel from '../models/team';
import GoalModel from '../models/goal';


function genArchivedAtQuery(isArchived) {
  // $exists: existance of field is null, if field is null the field exists
  // null: field does not exist OR field is null
  return isArchived ? { $exists: true } : null;
}

export async function show(req, res) {
  const userId = req.access_token.id;
  const organizationId = req.access_token.organization_id;

  let goal = await GoalModel
    .findById(req.params.id)
    .populate('assignee', 'firstname lastname')
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

export async function listAssignedToMe(req, res) {
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
      deleted_at: null
    })
    .populate('assignee', 'firstname lastname')
    .exec();


  res.status(200).json(goals)
}

export async function listTeamGoals(req, res) {
  const isArchived = !!req.query.is_archived;

  const userId = req.access_token.id;
  if (!userId) {
    return res.status(400).json({
      message: `user_id in access_token is null`
    });
  }

  const teams = await TeamModel
    .find({ team_roles: { $elemMatch: { user_id: userId } } })
    .exec()

  const teamIds = teams.map(el => el._id)

  const goals = await GoalModel.find({
    related_to: { $in: teamIds },
    archived_at: genArchivedAtQuery(isArchived),
    deleted_at: null
  }).exec()

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
    .exec();

  res.status(200).json(goals)
}

