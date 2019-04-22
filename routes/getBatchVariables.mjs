import { trickData } from '../common/variables';
export { getBatchVariables as default };

// Create a batch request??
// Figure out to get trick var heiarchy
function getBatchVariables(router, trickClient) {
    router.get('/cmd/getVariable', (req, res) => {
        // Send command to Trick
        console.log(req.body)
        // trickClient.write(`trick.var_add(\"${req.body.variable}\")\n`);

        // res.send({"value": trickData[0]});
    });
}