var config = {
    "ip_addr": "127.0.0.1",
    "api_port": 3000,
    "stream_port": 3001
};

var trickCommands = [];

var sieParsed = false;
function sieIsParsed(value) {
    sieParsed = true;
}

// Used to iterate through incoming Trick data
var channelList = [];
function addChannel(value){
    channelList.push(value);
}
function removeChannel(value) {
    var index = channelList.indexOf(value);
    if (index > -1) {
        channelList.splice(index, 1);
    }
}

function clearChannels() {
    channelList = [];
}

// Used to store current values needed to be fetched from Trick
var trickVariableMap = {};
function clearMap() {
    trickVariableMap = {};
}

function addVariableMap(value) {
    trickVariableMap[value] = "";
}

// Used to store all as JSON tree
var trickVariableTree = {};

// Command line arguements include Trick address and port
var commandLineArgs = "";
function setCommandLineArgs(value){
    commandLineArgs = value;
}

var classList = {};

var enumList = [];
function addEnum(value){
    enumList.push(value);
}

var topLevelObjectList = [];
function addTLO(value){
    topLevelObjectList.push(value);
}

export {
    config, 
    sieParsed,
    sieIsParsed,
    trickCommands, 
    channelList,
    clearChannels,
    addChannel,
    removeChannel,
    trickVariableMap,
    addVariableMap,
    clearMap,
    trickVariableTree,
    commandLineArgs,
    setCommandLineArgs,
    classList,
    enumList,
    addEnum,
    topLevelObjectList,
    addTLO,
};