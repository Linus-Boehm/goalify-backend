"use strict";

import TeamModel from '../models/team';
import GoalModel from '../models/goal';

export async function listAssignedToMe(req, res) {
  const userId = req.access_token.id;
  if (!userId) {
    return res.status(422).json({
      message: `user_id in access_token is null`
    });
  }

  const goals = await GoalModel.find({ assignee: userId }).exec();


  res.status(200).json(goals)
}

export async function listTeamGoals(req, res) {
  const userId = req.access_token.id;
  if (!userId) {
    return res.status(422).json({
      message: `user_id in access_token is null`
    });
  }

  const teams = await TeamModel.find({ team_roles: { $elemMatch: { user_id: userId } } }).exec()
  const teamIds = teams.map(el => el._id)

  const goals = await GoalModel.find({ related_to: { $in: teamIds } }).exec();

  res.status(200).json(goals)
}
