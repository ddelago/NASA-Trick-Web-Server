import _ from 'lodash';
import { channelList, addChannel, trickVariableMap, addVariableMap, trickVariableTree } from '../../common/variables';
export { putChannelBatch as default };

function putChannelBatch(router, trickClient) {
    router.put('/data', (req, res) => {

        req.body.forEach(function(request) {
            putRequest(request, trickClient);
        });

        // Response to client
        res.send(channelList)
   });
}

function putRequest(request, trickClient) {
    // Extract trick variable from url
    var trickVariableChannel = request;

    // Get channel segments
    var channelSegs = trickVariableChannel.split('/');
    var lastChannelSeg = channelSegs[channelSegs.length - 1];
    
    // If recursive call
    if(lastChannelSeg == '*') {

        // Reconstruct into dot object notation string  
        var varString = "";
        for(var i = 0; i < channelSegs.length - 1; i++) {
            varString += (channelSegs[i] + '.'); 
        }
        // cut off trailing dot
        varString = varString.substring(0, varString.length - 1);

        // Get top level channel object
        var topChannel = {}
        if(varString == '') {
            topChannel = trickVariableTree;
        } 
        else {
            topChannel = _.get(trickVariableTree, varString);
        }

        // Build the subchannels 
        Object.keys(topChannel).forEach(function (member) {
            getChannelSegments(topChannel[member], `${trickVariableChannel.substring(0, trickVariableChannel.length - 1)}${member}`, trickClient);
        });

        return;
    }

    // Replace '/' channel notation to dot notation
    var trickVariable = trickVariableChannel.replace(/[/]/g, ".");

    // Send to Trick if it does not exist already
    if(!channelList.includes(trickVariableChannel)) {
        trickClient.write(`trick.var_add(\"${trickVariable}\")\n`);
        // Update channel list and variable map
        addChannel(trickVariableChannel)
        addVariableMap(trickVariableChannel);
    }
}

// Recursively build subchannels and add them to channelList
function getChannelSegments(channelObject, channelSegment, trickClient) {
    var channelMembers = Object.keys(channelObject);

    // If Channel segment has no subchannels
    if(channelMembers.length == 1 && channelMembers[0] == 'trickVarString') {
        // Replace '/' channel notation to dot notation
        var trickVariable = channelSegment.replace(/[/]/g, ".");

        // Send to Trick if it does not exist already
        if(!channelList.includes(`${channelSegment}`)) {
            trickClient.write(`trick.var_add(\"${trickVariable}\")\n`);
            // Update channel list and variable map
            addChannel(`${channelSegment}`);
            addVariableMap(`${channelSegment}`);
        }
        return;
    }
    
    // Recurse on subchannels
    channelMembers.forEach(function(member) {
        getChannelSegments(channelObject[member], `${channelSegment}/${member}`, trickClient);
    })
}