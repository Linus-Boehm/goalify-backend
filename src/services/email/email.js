import {MailTemplates, SendGridAPIKey, FrontendUrl} from "../../config";
import * as TokenService from '../auth/token'

const sgMail = require('@sendgrid/mail');


async function sendEmail(to, templateId, data) {

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
    //console.log(msg)
    await sgMail.send(msg)
}

export function sendVerifyEmail({id, firstname, lastname, email}) {
    const token = TokenService.createVerfiyToken(id);
    const url = FrontendUrl + "/auth/confirm?token=" + token;
    return sendEmail(email, MailTemplates.verifySignUp, {firstname, lastname, verfiy_link: url})
}
