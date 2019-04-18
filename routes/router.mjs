import express from 'express';
const router = express.Router();
import { trickData } from '../common/variables';
export { router, getVariable, getBatchVariables, addVariable };

// Get a variable's current value from Trick
function getVariable(trickClient) {
    router.get('/cmd/getVariable', (req, res) => {

        console.log(req.body);

        // Send command to Trick
        trickClient.write(`trick.var_add(\"${req.body.variable}\")\n`);

        res.send({"value": trickData[0]});
    });
}

// Create a batch request??
function getBatchVariables(trickClient) {
    router.get('/cmd/getVariable', (req, res) => {
        // Send command to Trick
        console.log(req.body)
        // trickClient.write(`trick.var_add(\"${req.body.variable}\")\n`);

        // res.send({"value": trickData[0]});
    });
}

// PUT request will store value to a json object.
// Server will then CONSTANTLY update those values from Trick.
function addVariable(trickClient) {
    // Add a variable to track
    router.put('/cmd/addVariable', (req, res) => {
        // Send command to Trick
        trickClient.write(`trick.var_add(\"${req.body.variable}\")\n`);

        // Reply to trickClient
        res.send(`Now tracking ${req.body.variable}`);
    });
}