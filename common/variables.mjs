var config = {
    "ip_addr": "127.0.0.1",
    "api_port": 3000,
    "stream_port": 3001
};

var trickCommands = [];

var trickVariables = [];
function addTrickVariable(value){
    trickVariables.push(value);
}

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
    addTrickVariable,
    commandLineArgs,
    setCommandLineArgs,
    trickData,
    setTrickData,
};