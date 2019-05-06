import express from 'express';
const router = express.Router();

import getVariable from './routes/getVariable';
import getBatchVariables from './routes/getBatchVariables';
import addVariable from './routes/addVariable';
import getVariableList from './routes/getVariableList';
import setVariable from './routes/setVariable';

export { router, setRoutes };

function setRoutes(trickClient) {
    getVariable(router, trickClient);
    setVariable(router, trickClient);
    getBatchVariables(router, trickClient);
    getVariableList(router, trickClient);
    // addVariable(router, trickClient);
}