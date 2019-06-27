"use strict";

import bcrypt from 'bcryptjs'
import { Schema, model } from 'mongoose';
import uuid from 'uuid'
import * as config from '../config';

const UserSchema = new Schema({
  _id: { type: String, default: uuid.v4 },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,

  },
  lastname: {
    type: String,
    required: true,

  },
  role: {
    type: String,
    default: "employee",

  },
  organization_id: {
    type: String,
    required: true,
    index: true
  }
});

UserSchema.set('versionKey', false);

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
});

UserSchema.methods.comparePassword = async function (plaintext) {
  return bcrypt.compareSync(plaintext, this.password);
};

export default model('User', UserSchema);