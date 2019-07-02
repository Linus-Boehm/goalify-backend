"use strict";
import jwt from 'jsonwebtoken';
import logger from 'morgan'
import helmet from 'helmet';
import bodyParser from "body-parser";
import { JwtSecret } from '../config';

export function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.status(200).send('OK');
  } else {
    next();
  }
}

export function errorHandler(err, req, res, next) {

  console.log(err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  })
}

export function isAuthenticated(req, res, next) {
  const header = req.headers[ 'authorization' ];

  if (header) {
    // Remove Bearer from string
    let token = header.split(' ')[ 1 ]
    try{
      req.access_token = jwt.verify(token, JwtSecret);
      return next()
    }catch(e){
    }



  }
  res.status(403).send("Authentication error")
}


export function applyBasicMiddlewares(app) {
  app.use(logger('combined'));
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(allowCrossDomain)
}
