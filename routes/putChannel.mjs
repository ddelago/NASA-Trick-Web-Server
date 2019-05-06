import { channelList, addChannel, trickVariableMap } from '../common/variables';
export { putChannel as default };

function putChannel(router, trickClient) {
    router.put('/data/*', (req, res) => {

        // Extract trick variable from url
        var trickVariableChannel = req.url.substring(6);

        // Replace '/' channel notation to dot notation
        var trickVariable = trickVariableChannel.replace(/[/]/g, ".");

        // Send to Trick
        trickClient.write(`trick.var_add(\"${trickVariable}\")\n`);

        // Update channel list and variable map
        addChannel(trickVariableChannel)
        trickVariableMap[trickVariableChannel] = "";

        // Response to client
        res.send(channelList)
   });
}