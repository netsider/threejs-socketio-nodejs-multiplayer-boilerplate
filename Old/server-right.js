console.log("Server Started....");
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
var data = new Object();
var users = Array();
app.listen(8080);
function handler (req, res) {
  fs.readFile(__dirname + '/client-alpha-new-3.html',
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
	console.log(users);
    var usernumber = users.length; // Gets length of users and
	
    users[usernumber] = new Array();  
    // users[usernumber][1] = Math.floor((Math.random()*1000)+1);
    users[usernumber][1] = 10;
	//data[0] = users[usernumber][1];
    // users[usernumber][2] = Math.floor((Math.random()*600)+1);  
    users[usernumber][2] = 10;
	PX = users[usernumber][1]; // X coordinate
    PY = users[usernumber][2]; // Y coordinate	
    users[usernumber][3] = userName;
	io.sockets.emit('playercreate', userName, PX, PY, usernumber);
    io.sockets.emit('getplayers', users); 
	console.log(data);
    io.sockets.emit('playermove', '45', usernumber); // To update without keypress on client
  });

  socket.on('syncplayers', function(user) { 
	console.log("syncplayers(user)");  
    users = user;  
  });

  socket.on('keypress', function (data) {
  console.log("keypress(data)");
    io.sockets.emit('playermove', data[0], data[1]);  
  });  
  // Listens for clients leaving game
 // socket.on('leave', function (userName) {
   // var l = users.length;
   // for (var i = 0; i < l; i++) {
   //   if (users[i][3] == userName) {
   //     clientid = i;
  //    }
  //  }  
  //  users.splice(clientid, 1);
  //  console.log(users);
  //  io.sockets.emit('getplayers', users); 
  //  io.sockets.emit('removeplayer', clientid); 
  //  io.sockets.emit('playermove', '45', clientid); // To update without keypress on client 
 // }); 
}); 