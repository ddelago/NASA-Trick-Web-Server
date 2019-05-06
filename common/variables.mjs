var config = {
    "ip_addr": "127.0.0.1",
    "api_port": 3000,
    "stream_port": 3001
};

var trickCommands = [];

var channelList = [];
function addChannel(value){
    channelList.push(value);
}

// Used to store current values needed to be fetched from Trick
var trickVariableMap = {};

// Used to store all as JSON tree
var trickVariablesTree = {};

// Command line arguements include Trick address and port
var commandLineArgs = "";
function setCommandLineArgs(value){
    commandLineArgs = value;
}

export {
    config, 
    trickCommands, 
    channelList,
    addChannel,
    trickVariableMap,
    trickVariablesTree,
    commandLineArgs,
    setCommandLineArgs,
};