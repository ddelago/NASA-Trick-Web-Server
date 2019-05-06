import express from 'express';
const router = express.Router();

import getVariable from './routes/getVariable';
import getBatchVariables from './routes/getBatchVariables';
import getVariableList from './routes/getVariableList';
import setVariable from './routes/setVariable';
import putChannel from './routes/putChannel';
import putChannelBatch from './routes/putChannelBatch';

export { router, setRoutes };

function setRoutes(trickClient) {
    getVariable(router, trickClient);
    setVariable(router, trickClient);
    getBatchVariables(router, trickClient);
    getVariableList(router, trickClient);
    putChannel(router, trickClient);
    putChannelBatch(router, trickClient);
}