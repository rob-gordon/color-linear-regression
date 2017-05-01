// content of index.js
const http = require('http');
const app = http.createServer(requestHandler)
const io = require('socket.io')(app);
const port = 3000;
const shell = require('shelljs');


io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


function requestHandler(request, response) {  
	console.log(request.url);
	
	// Check for ImageMagick
	if (shell.which('identify')) {

		// Load Image Color Info
		var imgInfo = shell.exec('identify -verbose ~/Desktop/smile.png').stdout;
		const regex = /\d+: \([\d\s]{3},[\d\s]{3},[\d\s]{3},[\d\s]{3}\) #[A-F0-9]{8} [\w\(\),]+/g;
		let m, matchString = "";
		while ((m = regex.exec(imgInfo)) !== null) {
		    // This is necessary to avoid infinite loops with zero-width matches
		    if (m.index === regex.lastIndex) {
		        regex.lastIndex++;
		    }

		    debugger;
		    
		    // The result can be accessed through the `m`-variable.
		    m.forEach((match, groupIndex) => {
		        matchString += `Found match, group ${groupIndex}: ${match}`;
		    });
		}
		//shell.exec('identify -verbose smile.png')
		//shell.exit(1);
		response.end(matchString);
	}

	response.end('Sorry, this script requires imagemagick');
}





app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});