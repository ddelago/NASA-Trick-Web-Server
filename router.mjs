import express from 'express';
const router = express.Router();

import getVariable from './routes/getVariable';
import getBatchVariables from './routes/getBatchVariables';
import addVariable from './routes/addVariable';
import getAvailableVariables from './routes/getAvailableVariables';
import getTrickCommands from './routes/getTrickCommands';

export { router, setRoutes };

function setRoutes(trickClient) {
    getVariable(router, trickClient);
    getBatchVariables(router, trickClient);
    addVariable(router, trickClient);
    getAvailableVariables(router, trickClient);
    getTrickCommands(router, trickClient);
}