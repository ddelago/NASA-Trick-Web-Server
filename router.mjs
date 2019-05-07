import express from 'express';
const router = express.Router();

// data
import getVariable from './routes/data/getVariable';
import getBatchVariables from './routes/data/getBatchVariables';
import getVariableList from './routes/data/getVariableList';
import putChannel from './routes/data/putChannel';
// commands
import setVariable from './routes/cmd/setVariable';
import clearVariables from './routes/cmd/clearVariables';
// options
import getOptions from './routes/options/getOptions';

export { router, setRoutes };

function setRoutes(trickClient) {
    getVariable(router, trickClient);
    getBatchVariables(router, trickClient);
    getVariableList(router, trickClient);
    putChannel(router, trickClient);
    setVariable(router, trickClient);
    clearVariables(router, trickClient);
    getOptions(router, trickClient);
}