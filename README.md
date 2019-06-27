#Goalify Backend API

A Backend REST-API for the Goalify App

## Prerequisites

* nodejs [official website](https://nodejs.org/en/) 
+ [yarn](https://yarnpkg.com/en/docs/install#mac-stable) as package manager (works better for offline usage and teams)
* mongodb [official installation guide](https://docs.mongodb.org/manual/administration/install-community/)

**Optional:**
* [Robo 3T](https://robomongo.org/) as a GUI for MongoDB

## Setup

* Clone this Repository
* cd into the project root
```
cd path/to/workspace/goalify-backend
```
* rename the `.env.example` to `.env` and adjust the params as needed
* run yarn install to install all dependencies
* start database with `mongod --dbpath relative/path/to/database` 
* Create an empty Database named `goalifydb` (use Robo 3T or your command line)
* Start development environment with `yarn dev`
* Visit http://localhost:3000/

## Seed database
* Use yarn seed to seed the database
* Modify /spec/seed_database.js and /spec/factories/* if needed

 