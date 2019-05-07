import express from 'express';
const router = express.Router();

import getVariable from './routes/data/getVariable';
import getBatchVariables from './routes/data/getBatchVariables';
import getVariableList from './routes/data/getVariableList';
import putChannel from './routes/data/putChannel';
import putChannelBatch from './routes/data/putChannelBatch';
import setVariable from './routes/cmd/setVariable';
import clearVariables from './routes/cmd/clearVariables';
import getOptions from './routes/options/getOptions';

export { router, setRoutes };

function setRoutes(trickClient) {
    getVariable(router, trickClient);
    getBatchVariables(router, trickClient);
    getVariableList(router, trickClient);
    putChannel(router, trickClient);
    putChannelBatch(router, trickClient);
    setVariable(router, trickClient);
    clearVariables(router, trickClient);
    getOptions(router, trickClient);
}