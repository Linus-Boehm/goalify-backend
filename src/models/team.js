"use strict";
import { Schema, model } from 'mongoose';
import uuid from 'uuid'

const TeamRoleSchema = new Schema({
  _id: false,
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  role: {
    type: String,
    required: true,

  },
});

const TeamSchema = new Schema({
  _id: { type: String, default: uuid.v4 },
  name: { type: String, required: true, },
  organization_id: { type: String, required: true, },

  // refs
  team_roles: [ TeamRoleSchema ]

});

TeamSchema.set('versionKey', false);

TeamSchema.methods.addUser = async function (userId, role) {
  let teamRoleToAdd = { user_id: userId, role };

  // Find team role of user
  let existingTeamRoleIndex = this.team_roles.findIndex((el) => el.user_id === userId);

  if (existingTeamRoleIndex >= 0) {
    // Update
    const existingTeamRole = this.team_roles[ existingTeamRoleIndex ];
    this.team_roles[ existingTeamRoleIndex ] = {
      ...existingTeamRole,
      ...teamRoleToAdd
    }
  } else {
    // Insert
    this.team_roles.push(teamRoleToAdd);
  }

  return this.save()
};



export default model('Team', TeamSchema);
