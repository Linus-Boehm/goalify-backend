"use strict";

const mongoose = require('mongoose');
const uuid = require('uuid');
// Define the user schema

const UserSchema  = new mongoose.Schema({
    _id: { type: String, default: uuid.v4},
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password_hash: {
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

// Export the User model
module.exports = mongoose.model('User', UserSchema);