var config = {
    "ip_addr": "127.0.0.1",
    "api_port": 3000,
    "stream_port": 3001
};

const trickCommands = [];

// Store as object with names and values or array of variables names?
var trickVariables = {};

// Command line arguements include Trick address and port
var commandLineArgs = "";
function setCommandLineArgs(value){
    commandLineArgs = value;
}

// Store data received from Trick
var trickData = "";
function setTrickData(value){
    trickData = value;
}

export {
    config, 
    trickCommands, 
    trickVariables,
    commandLineArgs,
    setCommandLineArgs,
    trickData,
    setTrickData,
};