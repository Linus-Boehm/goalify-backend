"use strict";

import GoalModel from '../models/goal';

export async function listAssignedToMe(req, res) {
  const userId = req.access_token.user_id;

  const goals = await GoalModel.find({ assignee: userId }).exec();
  if (!goals)
    return res.status(404).json({
      message: `Goals not found`
    });

  res.status(200).json(goals)
}