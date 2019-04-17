// var net = require('net');

// var server = net.createServer(function(socket) {
// 	socket.write('Echo server\r\n');
// 	socket.pipe(socket);
// });

// server.listen(1337, '127.0.0.1');


var net = require('net');


var client = new net.Socket();

client.connect(3000, '127.0.0.1', function() {
    console.log('Connected'); 
});

client.write('GET / HTTP/1.0\r\n\r\n')

client.on('data', function(data) {
	console.log('Received: ' + data);
	// client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

