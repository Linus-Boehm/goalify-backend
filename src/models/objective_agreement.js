"use strict";
import { Schema, model } from "mongoose";
import uuid from "uuid";
import bcrypt from "bcryptjs";

const ObjectiveAgreementSchema = new Schema({
  _id: { type: String, default: uuid.v4 },
  start_date: { type: Date },
  end_date: { type: Date },
  description: { type: String },

  bonus: { type: String },
  max_bonus: { type: String },

  assignee_confirmed: { type: Boolean, default: false },
  reviewer_confirmed: { type: Boolean, default: false },

  assignee: { type: String, ref: "User" },
  reviewer: { type: String, ref: "User" },

  organization: { type: String, required: true, ref: "Organization" }
});

ObjectiveAgreementSchema.set("versionKey", false);

export default model("ObjectiveAgreement", ObjectiveAgreementSchema);
