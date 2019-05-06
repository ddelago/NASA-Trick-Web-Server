import { trickData } from '../common/variables';
export { setvariable as default };

function setvariable(router, trickClient) {
    router.get('/data/commands', (req, res) => {

        // Extract trick variable from url
        // var trickVariableChannel = req.url.substring(6);

        res.send({
            "commands": trickData,
        });
    });
}