const express = require('express');
const launchesRouter = express.Router();

const {httpAddNewLaunch, httpGetAllLaunches} = require('./launches.controller');

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/',httpAddNewLaunch);

module.exports = launchesRouter;