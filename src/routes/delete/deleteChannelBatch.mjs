import deleteRequest from './deleteUtils';
export { deleteChannelBatch as default };

function deleteChannelBatch(router, trickClient) {
    router.delete('/data', (req, res) => {

        var channelsRemoved = [];

        req.body.forEach(function(channel) {
            var removed = deleteRequest(channel, trickClient)
            channelsRemoved.concat(removed);
        });

        // Response to client
        res.send(channelsRemoved);
   });
}