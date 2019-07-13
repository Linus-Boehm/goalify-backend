"use strict";
import { Schema, model } from 'mongoose';
import uuid from 'uuid'

const GOAL_TYPE = {
  QUALITATIVE: 'qualitative',
  COUNT: 'count',
  BOOLEAN: 'boolean'
};

const GoalSchema = new Schema({
  _id: { type: String, default: uuid.v4 },
  title: { type: String, required: true },
  description: { type: String },

  deleted_at: { type: Date },
  archived_at: { type: Date },

  is_private: { type: Boolean },

  progress_type: { type: String }, // enum GOAL_TYPE
  progress: { type: Number },

  // refs
  created_by: { type: String, ref: 'User', required: true },
  parent_goal: { type: String, ref: 'Goal' },
  assignee: { type: String, ref: 'User' },
  reviewer: { type: String, ref: 'User' },
  organization_id: { type: String, ref: 'Organization', required: true, index: true },
  related_to: { type: String, refPath: 'related_model' },
  related_model: { type: String }

});

GoalSchema.set('versionKey', false);

export default model('Goal', GoalSchema);
