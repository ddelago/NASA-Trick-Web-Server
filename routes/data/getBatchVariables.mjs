import { trickVariableMap } from '../../common/variables';
export { getBatchVariables as default };

function getBatchVariables(router, trickClient) {
    router.post('/data', (req, res) => {

        // List of variable values
        var trickData = [];

        // Get values from the variable map
        req.body.channels.forEach(function(variable) { 
            trickData.push(trickVariableMap[variable]);
        });

        res.send({
            "channel": req.body.channels,
            "data": trickData
        });
   });
}


// FETCH VERSION
// function getBatchVariables(router, trickClient) {
//     router.post('/data', (req, res) => {

//         // List of variables to send to Trick
//         var trickVarList = "";

//         // Send commands to Trick
//         req.body.channels.forEach(function(variable) { 
//             // Replace '/' channel notation to dot notation
//             variable = variable.replace(/[/]/g, ".");
//             trickVarList += `trick.var_add(\"${variable}\")\n`;
//         });

//         // Send list of variables to Trick
//         trickClient.write(trickVarList);
        
//         var trickData = "";

//         // Get response from Trick. MODIFY THIS LATER TO WAIT FOR RESPONSE FROM TRICK RATHER THAN LOOPING WAITING FOR VARIABLE TO CHANGE
//         trickClient.on('data', function(data) {
            
//             // Skip leading zero value, and cut off trailing new line character. Split on rest.
//             trickData = data.toString().substring(2,data.length-1).split("\t");

//             // Clear Trick stream
//             trickClient.pause();
//             trickClient.write('trick.var_clear()\n');
//             trickClient.resume();
//         });

//         function reply() {
//             // Wait for new value to be updated.
//             if(trickData == "") {
//                 setTimeout(reply, 1)
//             }
//             else {
//                 res.send({
//                     "channel": req.body.channels,
//                     "data": trickData,
//                 });
//             }
//         }

//         reply();
//    });
// }