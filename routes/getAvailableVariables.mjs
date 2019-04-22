import { trickData } from '../common/variables';
export { getAvailableVariables as default };

function getAvailableVariables(router, trickClient) {
    router.get('/cmd/getVariable', (req, res) => {
        // Send command to Trick
        console.log(req.body)
        // trickClient.write(`trick.var_add(\"${req.body.variable}\")\n`);

        // res.send({"value": trickData[0]});
    });
}