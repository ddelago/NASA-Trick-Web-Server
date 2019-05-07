import _ from 'lodash';
import { channelList, removeChannel, trickVariableMap, trickVariableTree } from '../../common/variables';
export { deleteChannel as default };

var channelsRemoved = [];

function deleteChannel(router, trickClient) {
    router.delete('/data/*', (req, res) => {

        channelsRemoved = [];

        // Extract trick variable from url
        var trickVariableChannel = req.url.substring(6);

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

            return res.send(channelsRemoved);
        }

        // Replace '/' channel notation to dot notation
        var trickVariable = trickVariableChannel.replace(/[/]/g, ".");

        // Send to Trick
        trickClient.write(`trick.var_remove(\"${trickVariable}\")\n`);

        // Update channel list and variable map
        channelsRemoved.push(trickVariableChannel);
        removeChannel(trickVariableChannel);
        delete trickVariableMap[trickVariableChannel];

        // Response to client
        res.send(channelsRemoved)
   });
}

// Recursively build subchannels and add them to channelList
function getChannelSegments(channelObject, channelSegment, trickClient) {
    var channelMembers = Object.keys(channelObject);

    // If Channel segment has no subchannels
    if(channelMembers.length == 1 && channelMembers[0] == 'trickVarString') {
        // Replace '/' channel notation to dot notation
        var trickVariable = channelSegment.replace(/[/]/g, ".");

        // Send to Trick
        trickClient.write(`trick.var_remove(\"${trickVariable}\")\n`);

        channelsRemoved.push(`${channelSegment}`);
        removeChannel(`${channelSegment}`);
        delete trickVariableMap[`${channelSegment}`];
        
        return;
    }
    
    // Recurse on subchannels
    channelMembers.forEach(function(member) {
        getChannelSegments(channelObject[member], `${channelSegment}/${member}`, trickClient);
    })
}