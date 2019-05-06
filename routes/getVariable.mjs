import { trickVariableMap } from '../common/variables';
export { getVariable as default };

// Get a variable's current value from Trick
function getVariable(router, trickClient) {
    router.get('/data/*', (req, res) => {

        // Extract trick variable from url
        var trickVariableChannel = req.url.substring(6);

        res.send({
            "channel": trickVariableChannel,
            "data": trickVariableMap[trickVariableChannel]
        });
   });
}