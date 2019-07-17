"use strict";

import CommentModel from "../models/comment";
import GoalModel from "../models/goal";
import { validationResult } from "express-validator/check";

export async function listComments(req, res) {
  const related_to = req.params.related_to;
  const userId = req.access_token.id;

  if (!userId) {
    return res.status(400).json({
      message: `user_id in access_token is null`
    });
  }

  const comments = await CommentModel.find({
    related_to
  }).exec();

  res.status(200).json(comments);
}

export async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const comment = req.body.comment;
  comment.created_by = req.access_token.id;
  comment.date = new Date();
  comment.related_to = req.body.related_to;

  try {
    let resComment = await CommentModel.create(comment);

    res.status(200).json(resComment);
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
