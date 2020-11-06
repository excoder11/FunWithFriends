var express = require('express');
var app = express();
var dataFile = require('./data/data.json');
var io= require('socket.io')();

app.set('port', process.env.PORT || 3000);
app.set('appData',dataFile);
app.set('view engine','ejs');

app.locals.siteTitle = 'Fun With Friends';
app.locals.allFriends = dataFile.friends;

app.use(express.static(__dirname+'/public'));
app.use(require('./routers/index'));
app.use(require('./routers/friends'));
app.use(require('./routers/feedback'));
app.use(require('./routers/api'));
app.use(require('./routers/chat'));


var Server = app.listen(app.get('port'), function(){
  console.log('listen to port '+app.get('port'));
});

io.attach(Server);
io.on('connection', function(socket) {
  socket.on('postMessage', function(data) {
    io.emit('updateMessages', data);
  });
});
