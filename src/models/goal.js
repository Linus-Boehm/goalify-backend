"use strict";
import { Schema, model } from 'mongoose';
import uuid from 'uuid'

const GoalSchema = new Schema({
  _id: { type: String, default: uuid.v4 },
  title: { type: String, required: true },
  description: { type: String},

  is_private: { type: Boolean},

  // refs
  created_by: { type: String, ref: 'User', required: true },
  parent_goal: { type: String, ref: 'Goal' },
  assignee: { type: String, ref: 'User' },
  reviewer: { type: String, ref: 'User' },

  related_to: { type: String, refPath: 'related_model'},
  related_model: { type: String }

});

GoalSchema.set('versionKey', false);

export default model('Goal', GoalSchema);
