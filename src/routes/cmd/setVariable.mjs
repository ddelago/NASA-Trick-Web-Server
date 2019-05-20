
export { setVariable as default };

function setVariable(router, trickClient) {
    router.post('/cmd/*', (req, res) => {

        // Extract trick variable from url
        var trickVariableChannel = req.url.substring(5);

        // Replace '/' channel notation to dot notation
        var trickVariable = trickVariableChannel.replace(/[/]/g, ".");

        // Update value
        trickClient.write(`trick.var_set(\"${trickVariable}\", ${req.body.value})\n`);

        res.send("SUCCESS")
   });
}
