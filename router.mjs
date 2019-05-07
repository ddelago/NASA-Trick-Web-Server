import express from 'express';
import getVariable from './routes/data/getVariable';
import getBatchVariables from './routes/data/getBatchVariables';
import getVariableList from './routes/data/getVariableList';
import putChannel from './routes/data/putChannel';
import setVariable from './routes/cmd/setVariable';
import clearVariables from './routes/cmd/clearVariables';
import getOptions from './routes/options/getOptions';
import deleteChannel from './routes/options/deleteChannel';

const router = express.Router();

export { router, setRoutes };

function setRoutes(trickClient) {
    getVariable(router, trickClient);
    getBatchVariables(router, trickClient);
    getVariableList(router, trickClient);
    putChannel(router, trickClient);
    setVariable(router, trickClient);
    clearVariables(router, trickClient);
    getOptions(router, trickClient);
    deleteChannel(router, trickClient);
}