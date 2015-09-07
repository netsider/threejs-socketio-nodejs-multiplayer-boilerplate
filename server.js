var port = 8080;
console.log("Server started on port: " + port);
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
var users = Array();
app.listen(port);
var userelements;
function handler (req, res) {
  fs.readFile(__dirname + '/client.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading HTML');
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
		'keypress',clientData = this.id; // Attach socketio userid
		userelements = users[usernumber][3].length;
		io.sockets.emit('getplayers', users);  
		io.sockets.emit('playermove', '45', usernumber); // To update without keypress on client
	});
  socket.on('syncplayers', function(user) { 
	console.log("syncplayers(user)");  
    console.log("User: " + user);
	users = user;
	console.log("Users: " + users);
  });
  socket.on('keypress', function (data) {
  console.log("keypress(data)");
    io.sockets.emit('playermove', data[0], data[1]);  
  });
 
 function FindUserID(userName){
	 	var l = users.length;
		for (var i = 0; i < l; i++) {
		if (users[i][3] == userName) {
				return users[i][0];
			}
		}
		return false;
 };
 
  function FindUserName(ID){
	 	var l = users.length;
		for (var i = 0; i < l; i++) {
		if (users[i][0] == ID) {
				return users[i][3];
			}
		}
		return false;
 };
 
 socket.on('leave', function (userName) {
		leave(userName);
	});

	socket.on('disconnect', function () { // called when connection drops
		console.log("------disconnect()------");
		console.log("users: "  + users);
		for (i in users) {
			if(users[i][0] == this.id){
				var ID = this.id;
				var UserToRemove = FindUserName(ID);
				console.log("User to Remove: "  + UserToRemove);
				leave(UserToRemove);
				console.log("users: "  + users);
			}
		}
	});
	
	function leave(user){
		var index = users.indexOf(user);
		users.splice(index, userelements);
		console.log("Users Before getplayers():" + users);		
		io.sockets.emit('getplayers', users);
		console.log("Users After getplayers():" + users);		
		clientid = FindUserID(user);
		io.sockets.emit('playermove', '45', clientid); // To update without keypress on client (since playermove is normally usually only called when user presses key)
	}
	
}); 