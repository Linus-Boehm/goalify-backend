"use strict";
import {Schema, model, Decimal128} from 'mongoose';
import uuid from 'uuid'

export const GOAL_TYPE = {
    QUALITATIVE: 'qualitative',
    COUNT: 'count',
    BOOLEAN: 'boolean'
};


const ProgressSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    date: {type: Date},
    is_reviewed: {type: Boolean},
    value: {type: String},
    comment_id: {type: String}
});

const GoalSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    title: {type: String, required: true},
    description: {type: String},

    deleted_at: {type: Date},
    archived_at: {type: Date},

    is_private: {type: Boolean},
    progress: [ProgressSchema],
    progress_type: {type: String}, // enum GOAL_TYPE
    maximum_progress: {type: String},
    oa_weight: {type: Number},

    // refs
    created_by: {type: String, ref: "User", required: true},
    parent_goal: {type: String, ref: "Goal"},
    assignee: {type: String, ref: "User"},
    reviewer: {type: String, ref: "User"},
    organization_id: {
        type: String,
        ref: "Organization",
        required: true,
        index: true
    },
    related_to: {type: String, refPath: "related_model"},
    related_model: {type: String}
});

GoalSchema.set("versionKey", false);

export default model("Goal", GoalSchema);
