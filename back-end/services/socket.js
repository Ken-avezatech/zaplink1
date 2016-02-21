'use strict';

module.exports = function(socket) {
  let tempSocket = socket;
  console.log('client connected');

  socket.emit('getUserIdAfterDisconnection');

  socket.on('sendUserIdAfterDisconnection', function(id) {
    if (id) {
      socket.join(id);

      io.User
        .findById(id)
        .exec()
        .then(user => {
          user.rooms.forEach(room => {
            socket.join(room);
          })
        });
    }
  });

  socket.on('disconnect', function() {
    console.log('disconnect');
  });

  socket.on('saveUserId', function(id) {
    socket.join(id);

    io.User
      .findById(id)
      .exec()
      .then(user => {
        user.rooms.forEach(room => {
          socket.join(room);
        })
      });
  });

  socket.on('completed', function(data) {
    tempSocket.to(data.otherID).emit('completed', data);
  });

  socket.on('add_ice_candidate', function(data) {
    tempSocket.to(data.otherID).emit('receiving_ice_candidate', data);
  });

  socket.on('making_a_call', function(data) {
    tempSocket.to(data.otherID).emit('receiving_a_call', data);
  });

  socket.on('makingAnAnswer', function(data) {
    tempSocket.to(data.otherID).emit('receivingAnAnswer', data);
  });

  socket.on('rejectFromCaller', function(data) {
    tempSocket.to(data.otherID).emit('rejectFromCaller', data);
  });

  socket.on('rejectFromCallee', function(data) {
    tempSocket.to(data.otherID).emit('rejectFromCallee', data);
  });

  socket.on('callee_is_ringing', function(data) {
    tempSocket.to(data.otherID).emit('calleeIsRinging', data);
  });

  socket.on('calleeIsRingingAccepted', function(data) {
    tempSocket.to(data.otherID).emit('calleeIsRingingAccepted');
  });

  /*set the socket*/
  socket.on('initializeRoomConnection', function(data) {
    let otherUserId   = data.otherUserId.toString().trim();
    let currentUserId = data.currentUserId.toString().trim();
    socket.join(data.otherUserId);

    socket_io.to(currentUserId).emit('initializeRoomConnection', data);
    socket_io.to(otherUserId).emit('initializeRoomConnection', data);
  });

  socket.on('joinRoom', function(data) {
    socket.join(data.roomId);

    let message = {};
    message.message = data.message;
    message.id      = data.currentUserId;

    setTimeout(function() {
      socket_io.to(data.roomId).emit('sendMessage', message);
    }, 0);
  });

  socket.on('sendMessage', function(data) {
    let message = {};
    message.message = data.message;
    message.id      = data.currentUserId;

    if (!!!data.room) {
      tempSocket.to(data.otherUserId).emit('sendMessage', message);
      socket.emit('sendMessage', message);
    } else {
      tempSocket.to(data.roomId).emit('sendMessage', message);
      socket.emit('sendMessage', message);
    }
  });
};
