"use strict";

import { Schema, model } from "mongoose";
import uuid from "uuid";
import * as config from "../config";

const CommentSchema = new Schema({
  _id: { type: String, default: uuid.v4 },

  text: {
    type: String,
    required: true
  },

  date: { type: String, required: true },

  //refs

  created_by: { type: String, ref: "User", required: true },

  related_to: { type: String, refPath: "related_model", required: true },

  related_model: { type: String }
});

CommentSchema.set("versionKey", false);

export default model("Comment", CommentSchema);
