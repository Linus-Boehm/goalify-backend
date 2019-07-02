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

TeamSchema.methods.addUser = async function ({user_id, role}) {
  let teamRoleToAdd = { user_id, role };
  console.log(teamRoleToAdd)
  // Find team role of user
  let existingTeamRoleIndex = this.team_roles.findIndex((el) => el.user_id === user_id);

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

TeamSchema.methods.removeUser = async function (user_id) {

  // Find team role of user
  let index = this.team_roles.findIndex((el) => el.user_id === user_id);

  if (index >= 0) {
    // Update
    this.team_roles.splice(index, 1)
  }

  return this.save()
};


export default model('Team', TeamSchema);
