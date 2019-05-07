
export { setvariable as default };

function setvariable(router, trickClient) {
    router.post('/cmd/setVariable/*', (req, res) => {

        // Extract trick variable from url
        var trickVariableChannel = req.url.substring(17);

        // Replace '/' channel notation to dot notation
        var trickVariable = trickVariableChannel.replace(/[/]/g, ".");

        console.log(req.body)

        // List of variables to send to Trick
        var trickVarList = "";
        trickVarList += `trick.var_set(\"${trickVariable}\", ${0})\n`;
        trickClient.write(trickVarList);
   });
}