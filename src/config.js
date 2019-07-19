"use strict";

require('dotenv').config()

export const port = process.env.API_PORT;
export const mongoURI = process.env.MONGODB_URI;
export const JwtSecret = process.env.JWT_SECRET;
export const SendGridAPIKey = process.env.SENDGRID_API_KEY;

export const FrontendUrl = "http://localhost:8080";

export const MailTemplates = {
    verifySignUp: "d-0bf037942fd1496a9f393eb2a96fa9a6",
    OAGoalUpdate: "",
    inviteUser: "",
    inviteTeamMember: "d-682a9a2d348e4bdca0f119d48c8d61a7"

};

