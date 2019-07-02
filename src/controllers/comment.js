"use strict";

import CommentModel from "../models/comment";
import GoalModel from "../models/goal";
import { validationResult } from "express-validator/check";

export async function listComments(req, res) {
  const commentId = req.access_token.id;
  if (!commentId) {
    return res.status(400).json({
      message: `comment_id in access_token is null`
    });
  }
  const goals = await GoalModel.find({
    $elemMatch: { goal_id: commentId }
  }).exec();

  const goalIds = goals.map(el => el._id);

  const comments = await CommentModel.find({
    related_to: { $in: goalIds }
  }).exec();

  res.status(200).json(comments);
}

export async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const comment = req.body;

  try {
    let userObj = await CommentModel.create(comment);

    res.status(200).json({ user: userObj });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({
        error: "Comment error",
        message: error.message
      });
    } else {
      throw error;
    }
  }
}
