
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

        // var trickData = "";

        // // Get response from Trick. MODIFY THIS LATER TO WAIT FOR RESPONSE FROM TRICK RATHER THAN LOOPING WAITING FOR VARIABLE TO CHANGE
        // trickClient.on('data', function(data) {
            
        //     // Skip leading zero value, and cut off trailing new line character. Split on rest.
        //     trickData = data.toString().substring(2,data.length-1).split("\t");

        //     // Clear Trick stream
        //     trickClient.pause();
        //     trickClient.write('trick.var_clear()\n');
        //     trickClient.resume();
        // });

        // function reply() {
        //     // Wait for new value to be updated.
        //     if(trickData == "") {
        //         setTimeout(reply, 1)
        //     }
        //     else {
        //         res.send({
        //             "channel": trickVariableChannel,
        //             "data": trickData,
        //         });
        //     }
        // }

        // reply();
   });
}