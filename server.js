// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

// thing
var shell = require('shelljs');

var is_loading = false;

// global vars
var ___file = "/Users/robgordon/Desktop/smile.png";

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

    client.on('setNewFileName', function(name) {
    	___file = name;
    });

    client.on('run', function(run) {
    	if (run && !is_loading) {
    		is_loading = true;
    		console.log("its time to run");
        
        var imgData = getDataFromFile(function(out) {
          is_loading = false;
          var list = parseImgData(out);
          var colors = [];
          var regex = /(\d{1,10000000}): \(([ \d]{1,3},[ \d]{1,3},[ \d]{1,3},[ \d]{1,3})\) (#[A-F0-9]{8}) ([\w\d\(,\)]+)/g;
          for (var i = 0; i < out.length; i++) {
            while ((m = regex.exec(list[i])) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                var obj = {
                  count: m[1],
                  rgba: m[2],
                  hex: m[3],
                  name: m[4]
                };

                colors.push(obj);
            }
          }
          client.emit('imgData', colors);
        });
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

function getDataFromFile(callback) {
	var command = 'identify -verbose \"'+___file+'\"';

	var imgInfo = shell.exec(command, function(code, out, err) {
	is_loading = false;
	callback.call(this, out);
	return out;
  });
}