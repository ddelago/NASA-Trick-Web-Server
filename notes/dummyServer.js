// var net = require('net');

// var server = net.createServer(function(socket) {
// 	socket.write('Echo server\r\n');
// 	socket.pipe(socket);
// });

// server.listen(1337, '127.0.0.1');


var http = require('http');


var client = new net.Socket();

client.connect(45549, '139.169.172.213', function() {
    console.log('Connected'); 
});

// client.write("trick.var_pause()\n"); 
client.write("trick.var_add(\"dyn.satellite.pos[1]\") \n");
client.write("trick.var_add(\"dyn.satellite.pos[0]\") \n");
// client.write('trick.var_clear()\n');
// client.write("trick.var_unpause()\n");

client.on('data', function(data) {
	console.log('Received: ' + data);
	// client.destroy(); // kill client after server's response
});

setTimeout(function () {
	client.write('trick.var_clear()\n');
  }, 1000)


client.on('close', function() {
	console.log('Connection closed');
});

