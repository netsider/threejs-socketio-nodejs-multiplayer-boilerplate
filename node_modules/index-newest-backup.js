var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
//var databaseUrl = "test"; // "username:password@example.com/mydb" 
//var collections = ["accounts", "transactions"]
//var db = require("mongojs").connect(databaseUrl, collections);  
var users = Array();
app.listen(8080);
function handler (req, res) {
  fs.readFile(__dirname + '/client40-saved.php',
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
   //db.accounts.save({email: "a@a.com", password: "", sex: "male"}, function(err, saved) {
    //if( err || !saved ) console.log(err);
   // else console.log("User saved"); 
   //});
  // Setting name AND setting position
  socket.on('setname', function(userName) {   
    var usernumber = users.length;
    users[usernumber] = new Array();  
    users[usernumber][1] = Math.floor((Math.random()*1000)+1);
    users[usernumber][2] = Math.floor((Math.random()*600)+1);  
    users[usernumber][3] = userName;
    io.sockets.emit('getplayers', users);  
    io.sockets.emit('playermove', '45', usernumber); // To update without keypress on client
  });
  // Passes all player position information from client to be set in server  
  socket.on('syncplayers', function(user) {  
    users = user;  
    console.log(users);
  });
  // Listens for keypress and sends back to client
  socket.on('keypress', function (data) {
    io.sockets.emit('playermove', data[0], data[1]);  
  });  
  // Listens for clients leaving game
  socket.on('leave', function (userName) {
    var l = users.length;
    for (var i = 0; i < l; i++) {
      if (users[i][3] == userName) {
        clientid = i;
      }
    }  
    users.splice(clientid, 1);
    console.log(users);
    io.sockets.emit('getplayers', users); 
    io.sockets.emit('removeplayer', clientid); 
    io.sockets.emit('playermove', '45', clientid); // To update without keypress on client 
  }); 
}); 