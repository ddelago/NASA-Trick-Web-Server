import deleteRequest from './deleteUtils';
export { deleteChannel as default };

function deleteChannel(router, trickClient) {
    router.delete('/data/*', (req, res) => {

        var channel = req.url.substring(6);
        var channelsRemoved = deleteRequest(channel,  trickClient);

        // Response to client
        res.send(channelsRemoved)
   });
}