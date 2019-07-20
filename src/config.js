"use strict";

require('dotenv').config()

export const port = process.env.API_PORT;
export const mongoURI = process.env.MONGODB_URI;
export const JwtSecret = process.env.JWT_SECRET;
export const SendGridAPIKey = process.env.SENDGRID_API_KEY;

export const FrontendUrl = "http://localhost:8080";

export const MailTemplates = {
    verifySignUp: "d-0bf037942fd1496a9f393eb2a96fa9a6",
    forgotPassword: "d-722be799a310445a9195fd9c7824a0e2",
    OAGoalUpdate: "",
    goalProgressUpdate: "d-24af0c77b5d841e9aaf06800077f6df5",
    inviteUser: "d-bd02f17d2c0b4812b90926b7070707ff",
    inviteTeamMember: "d-682a9a2d348e4bdca0f119d48c8d61a7"

};

