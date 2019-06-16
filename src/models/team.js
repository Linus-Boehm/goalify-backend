"use strict";

const mongoose = require('mongoose');
const uuid = require('uuid');
// Define the user schema
const TeamMemberSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,

    },
});
const TeamSchema  = new mongoose.Schema({
    _id: { type: String, default: uuid.v4},
    name: {
        type: String,
        required: true,

    },
    organization_id: {
        type: String,
        required: true,

    },
    team_roles: [TeamMemberSchema]

});

TeamSchema.set('versionKey', false);

// Export the User model
module.exports = mongoose.model('Team', TeamSchema);