"use strict";

import { Schema, model } from "mongoose";
import uuid from "uuid";
import * as config from "../config";

export const COMMENT_TYPE = {
  COMMENT: 'comment',
  PROGRESS_COMMENT: 'progress_comment',
  FEED_COMMENT: 'feed_comment'
};

const CommentSchema = new Schema({
  _id: { type: String, default: uuid.v4 },

  text: {
    type: String,
    required: true
  },
  comment_type : {
    default: COMMENT_TYPE.COMMENT,
    type: String
  },
  date: { type: Date, required: true },

  //refs

  created_by: { type: String, ref: "User", required: true },

  related_to: { type: String, refPath: "related_model", required: true },

  related_model: { type: String }
});

CommentSchema.set("versionKey", false);

export default model("Comment", CommentSchema);
