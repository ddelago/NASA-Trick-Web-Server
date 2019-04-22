import { trickData } from '../common/variables';
export { addVariable as default };

// PUT request will store value to a json object.
// Server will then CONSTANTLY update those values from Trick.
function addVariable(router, trickClient) {
    // Add a variable to track
    router.put('/cmd/addVariable', (req, res) => {
        // Send command to Trick
        trickClient.write(`trick.var_add(\"${req.body.variable}\")\n`);

        // Reply to trickClient
        res.send(`Now tracking ${req.body.variable}`);
    });
}