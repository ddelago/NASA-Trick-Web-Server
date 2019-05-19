import _ from 'lodash';
import { channelList, classList, addChannel, addVariableMap, trickVariableTree } from '../../common/variables';
import putRequest from './dataUtils';
export { putChannel, putChannelNew };

function putChannel(router, trickClient) {
    router.put('/data/*', (req, res) => {

        var channel = req.url.substring(6);
        putRequest(channel,  trickClient);

        res.send(channelList);
   });
}

function putChannelNew(router, trickClient) {
    router.put('/data/*', (req, res) => {

        var channel = req.url.substring(6);

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
                addChannel(trickVariableChannel);
                addVariableMap(trickVariableChannel);
            }

            return res.send(channelList);
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
                getChannelSegments(`${trickVariableChannel.substring(0, trickVariableChannel.length - 2)}`, topChannel[member], trickClient);
            });
            return res.send(channelList);;
        } 

        // If only top level call
        else if(lastChannelSeg == '*') {
            // Check each member of the top level channel
            Object.keys(topChannel).forEach(function(member) {

                var subMembers = Object.keys(topChannel[member])

                // If the subchannel has no subchannels
                if(subMembers.includes('trickVarString')) {

                    // If the member has dimensions
                    if(subMembers.includes('dimension')) {
                        addDimensions(trickVariableChannel.substring(0, trickVariableChannel.length - 1), topChannel[member], trickClient);
                    }
                    else {
                        addChannelList(trickVariableChannel.substring(0, trickVariableChannel.length - 1), member, trickClient);
                    }
                }
            });
        }
        res.send(channelList);
    });
}

function addDimensions(channel, member, trickClient) {
    var dims = member.dimension.length;

    // Loop over dimensions
    for(var x = 0; x <= Number(member.dimension[0]); x++) {
        if(dims == 1) {
            addChannelList(channel, `${member.memberName}[${x}]`, trickClient)
        }

        // If 2 dimensions
        else {
            for(var y = 0; y <= Number(member.dimension[1]); y++) {
                if(dims == 2) {
                    addChannelList(channel, `${member.memberName}[${x}][${y}]`, trickClient)
                }

                // If 3 dimensions
                else {
                    for(var z = 0; z <= Number(member.dimension[2]); z++) {
                        addChannelList(channel, `${member.memberName}[${x}][${y}][${z}]`, trickClient)
                        if(z == Number(member.dimension[2]) - 1) break;
                    }
                }
                if(y == Number(member.dimension[1]) - 1) break;
            }
        }
        if(x == Number(member.dimension[0]) - 1) break;
    }
}

function addChannelList(channel, member, trickClient) {
    // console.log(channel, member)
    // Constructed variable channel, remove * from end then append member
    var channelSegment = `${channel}${member}`

    // Replace '/' channel notation to dot notation
    var trickVariable = channelSegment.replace(/[/]/g, ".");

    // Send to Trick if it does not exist already
    if(!channelList.includes(`${channelSegment}`)) {
        trickClient.write(`trick.var_add(\"${trickVariable}\")\n`);
        addChannel(`${channelSegment}`);
        addVariableMap(`${channelSegment}`);
    }
}



// Recursively build subchannels and add them to channelList
function getChannelSegments(channel, member, trickClient) {
    console.log(channel, member.memberName)
    var subMembers = Object.keys(member);

    // If the subchannel has no subchannels
    if(subMembers.includes('trickVarString')) {

        // If the member has dimensions
        if(subMembers.includes('dimension')) {
            return addDimensions(channel, member, trickClient);
        }
        else {
            return addChannelList(channel, member.memberName, trickClient);
        }
    }
    else {
        // Recurse on subchannels
        subMembers.shift();
        subMembers.forEach(function(subMember) {
            getChannelSegments(`${channel}${member.memberName}/`, member[subMember], trickClient);
        })
    }
}