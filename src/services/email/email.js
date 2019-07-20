import {MailTemplates, SendGridAPIKey, FrontendUrl} from "../../config";
import * as TokenService from '../auth/token'
import UserModel from "../../models/user";
import {keyBy} from "lodash";

const sgMail = require('@sendgrid/mail');


async function sendEmail(to, templateId, data) {
    if(!SendGridAPIKey){
        console.warn("Email Sending disabled - Missing SendGridAPIKey");
        return
    }
    sgMail.setApiKey(SendGridAPIKey);
    const msg = {
        to,
        from: 'no-reply@goalify.dev',
        templateId,
        dynamic_template_data: {...data},
        tracking_settings:{
            click_tracking: {enable:false,}
        }
    };
    console.log(msg)
    await sgMail.send(msg)
}

export function sendVerifyEmail({id, firstname, lastname, email}) {
    const token = TokenService.createVerfiyToken(id);
    const url = FrontendUrl + "/auth/confirm?token=" + token;
    return sendEmail(email, MailTemplates.verifySignUp, {firstname, lastname, verfiy_link: url})
}

export async function sendProgressToReviewGoalMail(goal, user_id) {
    const user = await UserModel.findOne({_id: user_id},).exec();
    const url = FrontendUrl + "/app/goals/progress?id=" + goal._id;
    const firstname = user.firstname;
    const lastname = user.lastname;
    const email = user.email;
    return sendEmail(email, MailTemplates.goalProgressUpdate, {firstname, goal, lastname, url})
}

export function sendUpdateAgreementGoalEmail(goal, user) {
    //TODO
    //const token = TokenService.createVerfiyToken(id);
    //const url = FrontendUrl + "/auth/confirm?token=" + token;
    //return sendEmail(email, MailTemplates.verifySignUp, {firstname, lastname, verfiy_link: url})

}

export function sendResetPasswordEmail(token, {firstname, lastname, email}) {
    const url = FrontendUrl + "/auth/reset?token=" + token;
    return sendEmail(email, MailTemplates.forgotPassword, {firstname, lastname,url})
}

export async function addTeamMember(team,user_id,manager_id) {
    if(user_id === manager_id){
        return
    }
    let users = await UserModel.find({_id: {$in:[user_id,manager_id]}},).exec()
    let userObjs = keyBy(users,'id');
    const team_url = FrontendUrl +"/app/teams?id="+team._id
    return sendEmail(userObjs[user_id].email, MailTemplates.inviteTeamMember, {user:userObjs[user_id],manager:userObjs[manager_id],team:team.name, team_url})


}