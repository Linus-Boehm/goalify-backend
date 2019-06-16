"use strict";

const mongoose = require('mongoose');
const uuid = require('uuid');
// Define the user schema

const OrganizationSchema  = new mongoose.Schema({
    _id: { type: String, default: uuid.v4},
    name: {
        type: String,
        required: true,

    },

});

OrganizationSchema.set('versionKey', false);

// Export the User model
module.exports = mongoose.model('Organization', OrganizationSchema);