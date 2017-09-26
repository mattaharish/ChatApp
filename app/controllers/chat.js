var socketio = require('socket.io');
var events = require('events');
var User = require('../models/User');
var Message = require('../models/Message');

var eventEmitter = new events.EventEmitter();

var loggedInUsers = {};

function loggedUsers(data, socket) {

  if (!(data in loggedInUsers))
    loggedInUsers[data] = socket;
}

module.exports.chat = function (http) {

  var io = socketio.listen(http);
  

  io.on('connection', function (socket) {
      
      socket.on('username', function(user){
        socket.user=user;
      });

      socket.on('loggedInUser', function (data) {
        
          eventEmitter.emit('updateOnline',socket.user);
          loggedUsers(data, socket);
      });
        
      socket.on('chat message', function (data) {
        
        if(data.to in loggedInUsers){
          
          loggedInUsers[data.from].emit('chat message', data);
          loggedInUsers[data.to].emit('chat message', data);
          eventEmitter.emit('save-message', data);
        }
        else{
          loggedInUsers[data.from].emit('chat message', data);
          eventEmitter.emit('save-message', data)
        }
        
      });

      socket.on('typing', function(data){

        if(data in loggedInUsers){
          loggedInUsers[data].emit('typing', data);
        }
      });

      socket.on('typingout', function(data){
        if(data in loggedInUsers){
          loggedInUsers[data].emit('typingout', data);
        }
      });

      socket.on('load-all-messages', function (fromto) {
          //console.log("From-to -->", fromto);
          Message.find({
              $and: [{
                  $or: [{
                    'from': fromto.from
                  }, {
                    'from': fromto.to
                  }]
                }, {
                  $or: [{
                    'to': fromto.from
                  }, {
                    'to': fromto.to
                  }]
                }
              ]
          }, function(err, results){

            socket.emit('all-messages', results);
          });
      });

    socket.on('disconnect', function () {
      
      socket.broadcast.emit('wentOffline', socket.user+" is now offline");
      eventEmitter.emit('updateOffline',socket.user);
      delete loggedInUsers[socket.user];

    }); //end socket disconnected
  });

  eventEmitter.on('updateOffline', function(data){
    User.findOneAndUpdate({username:data},{$set:{online:false}},function(err){
      if(err) throw err;
    });
  });

  eventEmitter.on('updateOnline', function(data){
    
    User.findOneAndUpdate({username:data},{$set:{online:true}},function(err){
      if(err) throw err;
    });
  });

eventEmitter.on('save-message', function (data) {
  
  var newMessage = new Message({
    from: data.from,
    to: data.to,
    message: data.msg,
    date: new Date()
  });
  
  newMessage.save(function (err) {
    if (err) {
      console.log(err);
    }
  });
});

return io;
}