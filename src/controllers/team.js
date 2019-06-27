"use strict";


const TeamModel = require('../models/team');

export async function list(req, res) {
    try {
        let teams = await TeamModel.find({organization_id: req.access_token.organization_id}).exec();
        if (!teams) return res.status(404).json({
            message: `Teams not found`
        });
        res.status(200).json(teams)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            error: 'Internal Server Error',
            message: e.message
        })
    }

}

export async function show(req, res) {
    try {
        let team = await TeamModel.findById(req.params.id).exec()
        if (!team) return res.status(404).json({
            message: `Team not found`
        });
        res.status(200).json(team)
    } catch (e) {
        console.error(e)
        res.status(500).json({
            error: 'Internal Server Error',
            message: e.message
        })
    }
}

export async function create(req, res) {
  try {
    console.log(req.body)
        let team = await TeamModel.create({...req.body, organization_id: req.access_token.organization_id}).exec()
        console.log(team)
    res.status(200).json(team)
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }

}

export async function update(req, res) {
    try {
        console.log(req.body)
        let team = await TeamModel.updateOne({_id: req.params.id},{...req.body, organization_id: req.access_token.organization_id, _id: req.params.id}).exec()
        console.log(team)
        res.status(200).json(team)
    }catch (e) {
        console.error(e)
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        })
    }
}

export async function remove(req, res) {

}