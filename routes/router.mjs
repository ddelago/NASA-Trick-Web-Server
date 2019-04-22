import express from 'express';
const router = express.Router();
import { trickData } from '../common/variables';
export { router, getVariable, getBatchVariables };

// Get a variable's current value from Trick
function getVariable(trickClient) {
    router.get('/cmd/getVariable/*', (req, res) => {

        var oldValue = trickData[0];

        // Extract trick variable from url
        var trickVariable = req.url.split("/");
        trickVariable = trickVariable[trickVariable.length - 1];

        // Send command to Trick
        trickClient.write(`trick.var_add(\"${trickVariable}\")\n`);

        function wait() {
            if(trickData[0] === oldValue) {
                setTimeout(wait, 25);
                return;
            }
            res.send({"value": trickData[0]});
        }

        // Wait for new value to be updated
        wait();
   });
}

// Create a batch request??
// Figure out to get trick var heiarchy
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
// function addVariable(trickClient) {
//     // Add a variable to track
//     router.put('/cmd/addVariable', (req, res) => {
//         // Send command to Trick
//         trickClient.write(`trick.var_add(\"${req.body.variable}\")\n`);

//         // Reply to trickClient
//         res.send(`Now tracking ${req.body.variable}`);
//     });
// }