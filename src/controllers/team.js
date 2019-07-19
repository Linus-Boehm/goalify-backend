"use strict";

import TeamModel from "../models/team";

import * as EmailService from '../services/email/email'

export async function list(req, res) {
    let teams = await TeamModel.find({
        organization_id: req.access_token.organization_id
    }).exec();
    if (!teams)
        return res.status(404).json({
            message: `Teams not found`
        });
    res.status(200).json(teams);
}

export async function show(req, res) {
    const organizationId = req.access_token.organization_id;

    let team = await TeamModel.findById(req.params.id)
        .populate("team_roles.user_id")
        .exec();
    if (!team)
        return res.status(404).json({
            message: `Team not found`
        });
    let users = [];
    for (let role of team.team_roles) {
        users.push({...role.user_id._doc});
        role.user_id = role.user_id._id;
    }
    if (team.organization_id !== organizationId)
        return res.status(403).json({
            message: `Unauthorized - Team is not in user's organization`
        });

    res.status(200).json({team, users});
}

export async function create(req, res) {
    console.log(req.body);
    let team = await TeamModel.create({
        ...req.body,
        organization_id: req.access_token.organization_id
    });
    console.log(team);
    res.status(200).json(team);
}

export async function update(req, res) {
    console.log(req.body);
    let team = await TeamModel.updateOne(
        {_id: req.params.id},
        {
            ...req.body,
            organization_id: req.access_token.organization_id,
            _id: req.params.id
        }
    ).exec();
    console.log(team);
    res.status(200).json(team);
}

export async function addMember(req, res) {
    let team = await TeamModel.findOne({_id: req.params.id, organization_id: req.access_token.organization_id})
    if(!team){
        res.status(500).json({error:"Team not found"});
    }
    let roles = await team.addUser(req.body)

    EmailService.addTeamMember(team, req.body.user_id, req.access_token.id)
    res.status(200).json(roles);
}

export async function removeMembers(req, res) {
    let team = await TeamModel.findOne({_id: req.params.id, organization_id: req.access_token.organization_id})
    let roles = await team.removeUser(req.params.userId)
    res.status(200).json(roles);
}

export async function remove(req, res) {
    console.log(req.body);
    let team = await TeamModel.deleteOne({
        _id: req.params.id,
        organization_id: req.access_token.organization_id
    }).exec();
    res.status(200).json(team);
}
