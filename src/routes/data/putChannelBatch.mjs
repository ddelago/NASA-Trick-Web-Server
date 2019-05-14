import { channelList } from '../../common/variables';
import putRequest from './dataUtils'
export { putChannelBatch as default };

function putChannelBatch(router, trickClient) {
    router.put('/data', (req, res) => {

        req.body.forEach(function(channel) {
            putRequest(channel, trickClient);
        });

        // Response to client
        res.send(channelList)
   });
}