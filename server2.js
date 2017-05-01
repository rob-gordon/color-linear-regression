// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

// thing
var shell = require('shelljs');

var is_loading = false;

app.use(express.static(__dirname + '/bower_components'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

server.listen(4200);

io.on('connection', function(client) {  
    console.log('Client connected...');
    client.emit('messages', 'Hello from server');

    client.on('join', function(data) {
        console.log(data);
    });

    client.on('run', function(run) {
    	if (run && !is_loading) {
    		is_loading = true;
    		console.log("its time to run");
    		client.emit('imgData', parseImgData(getDataFromFile()));
    	}
    });

});

function parseImgData(imgInfo) {
	var regex = /\d+: \([\d\s]{3},[\d\s]{3},[\d\s]{3},[\d\s]{3}\) #[A-F0-9]{8} [\w\(\),]+/g;
	var m, matchArr = [];
	while ((m = regex.exec(imgInfo)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}
		// The result can be accessed through the `m`-variable.
		m.forEach((match, groupIndex) => {
			matchArr.push(`Found match, group ${groupIndex}: ${match}`);
		});
	}
	return matchArr;
}

function getDataFromFile() {
	var file = "~/Desktop/smile.png"
	var command = 'identify -verbose '+file;
	var imgInfo = shell.execSync(command).stdout;

}