"use strict";

import {validationResult} from "express-validator/check";

import UserModel from '../models/user'
import * as EmailService from '../services/email/email'
import OrganizationModel from '../models/organization';
import * as TokenService from '../services/auth/token'
import jwt from 'jsonwebtoken';
import { JwtSecret } from '../config';

export async function login(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }

    const {email, password} = req.body;

    const user = await UserModel.findOne({email}).exec();

    //Avoid guessing of user accounts by trying different emails
    const fail = () => {
        res.status(401).json({
            token: null,
            error: 'Wrong Credentials'
        })
    }
    if (!user || !user._id) {
        return fail()
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {

        return fail()
    }
    if (!user.confirmed) {
        EmailService.sendVerifyEmail(user);
        return res.status(403).send({
            error: "User not confirmed",
            token: null
        });
    }
    const teams = await user.loadTeams();
    const token = TokenService.signToken(user);

    res.status(200).json({
        token,
        user,
        teams
    });
}


export async function register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }


    try {
        let user = req.body;
        const org = await OrganizationModel.create({name: user.organization_name})
        user = {
            ...user,
            organization_id: org._id,
            role: "organization_admin",
            confirmed: false,
        };


        let userObj = await UserModel.create(user);
        await EmailService.sendVerifyEmail(user);


        res.status(200).json({user: userObj});
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({
                error: 'User already exists',
                message: error.message
            })
        } else {
            throw error
        }
    }
}

export function logout(req, res) {
    res.status(200).send({token: null});
}

export async function confirm(req, res) {
    const token = req.body.token;
    console.log(token);
    if(!token){
        return res.status(401).json({
            error: 'No valid Token',
        })
    }
    try {
        let {id} = jwt.verify(token, JwtSecret, {sub: 'verify'})
        const user = await UserModel.findOneAndUpdate({_id:id},{confirmed:true}).exec();
        console.log(user)
        if(!!user){
            return res.status(200).json({})
        }
    }catch (e) {

    }
    return res.status(401).json({
        error: 'No valid Token',
    })

}