"use strict";
//Loads .env file into process.env
import express from 'express';
import * as http from 'http';

import mongoose from 'mongoose';
import * as config from './config';
import routes from './routes'
import { applyBasicMiddlewares } from "./routes/middlewares";

// Set the port to the API.
const app = express();
app.set('port', normalizePort(config.port || 3000));

// apply middlewares and routes
applyBasicMiddlewares(app);
app.get('/', (req, res) => {
  res.json({
    name: 'Hello Goalify'
  });
});
app.use('/', routes);

//Create a http server based on Express
const server = http.createServer(app);

server.on('listening', () => {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Server is listening on port ${bind}`);
});

server.on('error', (err) => {
  console.log('Server Error: ', err.message);
  process.exit(err.statusCode);
});

//Connect to the MongoDB database; then start the server
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(async () => {
    server.listen(app.get('port'))

  })
  .catch(err => {
    console.log('Error connecting to the database', err.message);
    process.exit(err.statusCode);
  });


// ---

function normalizePort(val) {
  let _port = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(_port)) {
    return val;
  } else if (_port >= 0) {
    return _port;
  } else {
    return false;
  }
}

