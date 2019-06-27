"use strict";

import { Schema, model } from 'mongoose';
import uuid from 'uuid'

const OrganizationSchema = new Schema({
  _id: { type: String, default: uuid.v4 },
  name: {
    type: String,
    required: true,
  },
});

OrganizationSchema.set('versionKey', false);

export default model('Organization', OrganizationSchema);