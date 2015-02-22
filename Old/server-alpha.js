console.log("Server Started....");
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
var users = Array();
app.listen(8080);
function handler (req, res) {
  fs.readFile(__dirname + '/client-alpha-112.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
} 
io.sockets.on('connection', function (socket) {
console.log("connection()");
  socket.on('setname', function(userName) {   
	console.log("setname(userName)");
	console.log(users); // Logs the users to the console whenever new player joins
    var usernumber = users.length; // Gets the index for a new user by using the length of the users array
    users[usernumber] = new Array();  
    users[usernumber][1] = 10; // X coordinate
    users[usernumber][2] = 10; // Y coordinate
    users[usernumber][3] = userName; // Username
    io.sockets.emit('getplayers', users);  
    io.sockets.emit('playermove', '45', usernumber); // To update without keydown
	io.sockets.emit('playercreate', userName, users[usernumber][1], users[usernumber][2], usernumber); // To update without keydown
  });
  socket.on('syncplayers', function(user) { 
	console.log("syncplayers(user)");  
    users = user;  
  });
  socket.on('otherplayers', function(user) { 
	console.log("otherplayers(user)");  
    users = user;  
	
	
	
	io.sockets.emit('playercreate', userName, users[usernumber][1], users[usernumber][2], usernumber); // To update without keydown
   });
  socket.on('keypress', function (data) {
  console.log("keypress(data)");
    io.sockets.emit('playermove', data[0], data[1]);  
  });  
}); 