import { channelList } from '../../common/variables';
import putRequest from './dataUtils';
export { putChannel as default };

function putChannel(router, trickClient) {
    router.put('/data/*', (req, res) => {

        var channel = req.url.substring(6);
        putRequest(channel,  trickClient);

        res.send(channelList);
   });
}