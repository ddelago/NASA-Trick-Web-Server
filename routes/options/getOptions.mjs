import _ from 'lodash';
import { trickVariableTree } from '../../common/variables';
export { getOptions as default };

// Get a variable's current value from Trick
function getOptions(router, trickClient) {
    router.options('/data/*', (req, res) => {

        // Extract trick variable from url
        var trickVariableChannel = req.url.substring(6);

        // Get channel segments
        var channelSegs = trickVariableChannel.split('/');
        var lastChannelSeg = channelSegs[channelSegs.length - 1];

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
        else
            topChannel = _.get(trickVariableTree, varString);

        // If recursive
        if (lastChannelSeg == '**') {
            
            var channelList = [];

            // Build the subchannels 
            Object.keys(topChannel).forEach(function (member) {
                getChannelSegments(topChannel[member], member, channelList);
            });
            res.send(channelList)
        }
        else if (lastChannelSeg == '*') {
            res.send(Object.keys(topChannel));
        }
   });
}

// Recursively build subchannels and add the to channelList
function getChannelSegments(channelObject, channelSegment, channelList) {
    var channelMembers = Object.keys(channelObject);

    // If Channel segment has no subchannels
    if(channelMembers.length == 1 && channelMembers[0] == 'trickVarString') {
        return channelList.push(`${channelSegment}`);
    }
    
    // Recurse on subchannels
    channelList.push(`${channelSegment}/`);
    channelMembers.forEach(function(member) {
        getChannelSegments(channelObject[member], `${channelSegment}/${member}`, channelList);
    })
}