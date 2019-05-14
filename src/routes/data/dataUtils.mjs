import _ from 'lodash';
import { channelList, addChannel, addVariableMap, trickVariableTree } from '../../common/variables';
export { putRequest as default };

function putRequest(channel, trickClient) {
    // Extract trick variable from url
    var trickVariableChannel = channel;

    // Get channel segments
    var channelSegs = trickVariableChannel.split('/');
    var lastChannelSeg = channelSegs[channelSegs.length - 1];

    // If not a recursive call
    if(lastChannelSeg != '**' && lastChannelSeg != '*') {
        // Replace '/' channel notation to dot notation
        var trickVariable = trickVariableChannel.replace(/[/]/g, ".");

        // Send to Trick if it does not exist already
        if(!channelList.includes(trickVariableChannel)) {
            trickClient.write(`trick.var_add(\"${trickVariable}\")\n`);
            // Update channel list and variable map
            addChannel(trickVariableChannel)
            addVariableMap(trickVariableChannel);
        }

        return;
    }

    // Reconstruct into dot object notation string  
    var varString = "";
    for(var i = 0; i < channelSegs.length - 1; i++) {
        varString += (channelSegs[i] + '.'); 
    }
    // cut off trailing dot
    varString = varString.substring(0, varString.length - 1);

    // Get top level channel object
    var topChannel = {}
    if(varString == '')
        topChannel = trickVariableTree; 
    // Gets the channel object from the variable string
    else
        topChannel = _.get(trickVariableTree, varString); 

    // If recursive call
    if(lastChannelSeg == '**') {
        // Build the subchannels 
        Object.keys(topChannel).forEach(function (member) {
            getChannelSegments(topChannel[member], `${trickVariableChannel.substring(0, trickVariableChannel.length - 2)}${member}`, trickClient);
        });
        return;
    } 
    // If only top level recursive call
    else if(lastChannelSeg == '*') {
        var channelMembers = Object.keys(topChannel);

        // Check each member of the top level channel
        channelMembers.forEach(function(member) {

            var childChannelMembers = Object.keys(topChannel[member])

            // If the subchannel has no subchannels
            if(childChannelMembers.length == 1 && childChannelMembers[0] == 'trickVarString') {
                // Constructed variable channel
                var channelSegment = `${trickVariableChannel.substring(0, trickVariableChannel.length - 1)}${member}`

                // Replace '/' channel notation to dot notation
                var trickVariable = channelSegment.replace(/[/]/g, ".");

                // Send to Trick if it does not exist already
                if(!channelList.includes(`${channelSegment}`)) {
                    trickClient.write(`trick.var_add(\"${trickVariable}\")\n`);
                    addChannel(`${channelSegment}`);
                    addVariableMap(`${channelSegment}`);
                }
            }
        });
        
        return;
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