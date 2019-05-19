import deleteRequest from './deleteUtils';
export { deleteChannelBatch as default };

function deleteChannelBatch(router, trickClient) {
    router.delete('/data', (req, res) => {

        var channelsRemoved = [];

        req.body.forEach(function(channel) {
            channelsRemoved.concat(deleteRequest(channel, trickClient));
        });

        // Response to client
        res.send(channelsRemoved);
   });
}