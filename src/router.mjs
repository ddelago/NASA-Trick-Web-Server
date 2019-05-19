import express from 'express';
import getVariable from './routes/data/getVariable';
import getVariableBatch from './routes/data/getVariableBatch';
import { putChannel, putChannelNew } from './routes/data/putChannel';
import putChannelBatch from './routes/data/putChannelBatch';
import deleteChannel from './routes/delete/deleteChannel';
import deleteChannelBatch from './routes/delete/deleteChannelBatch';
import setVariable from './routes/cmd/setVariable';
import clearVariables from './routes/cmd/clearVariables';
import getOptions from './routes/options/getOptions';

const router = express.Router();

export { router, setRoutes };

function setRoutes(trickClient) {
    getVariable(router, trickClient);
    getVariableBatch(router, trickClient);
    putChannelNew(router, trickClient);
    putChannelBatch(router, trickClient);
    deleteChannel(router, trickClient);
    deleteChannelBatch(router, trickClient);
    setVariable(router, trickClient);
    clearVariables(router, trickClient);
    getOptions(router, trickClient);
}