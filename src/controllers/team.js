"use strict";


const TeamModel = require('../models/team');

const list = async (req, res) => {
    try {
        let teams = await TeamModel.find({organization_id: req.access_token.organization_id})
        if (!teams) return res.status(404).json({
            message: `User not found`
        });
        res.status(200).json(teams)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        })
    }

}

const show = async (req, res) => {

}

const create = async (req, res) => {
    try {
        let team = await TeamModel.create({...req.body, organization_id: req.access_token.organization_id})
        res.status(200).json(team)
    }catch (e) {
        console.error(e)
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        })
    }

}
const update = async (req, res) => {

}

const remove = async (req, res) => {

}


module.exports = {
    create,
    update,
    remove,
    list,
    show
};