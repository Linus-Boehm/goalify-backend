"use strict";

import CommentModel from "../models/comment";
import GoalModel from "../models/goal";
import { validationResult } from "express-validator/check";

export async function listComments(req, res) {
  const goalId = req.params.goal_id;
  const userId = req.access_token.id;

  if (!userId) {
    return res.status(400).json({
      message: `user_id in access_token is null`
    });
  }

  const comments = await CommentModel.find({
    related_to: { $in: goalId }
  }).exec();
  console.log("HERE");
  console.log(comments);

  res.status(200).json(comments);
}

export async function create(req, res) {
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const comment = req.body.comment;
  comment.created_by = req.access_token.id;
  comment.date = new Date().toLocaleString();
  comment.related_to = req.body.goalId;

  try {
    let commentObj = await CommentModel.create(comment);

    res.status(200).json({ comment: commentObj });
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
