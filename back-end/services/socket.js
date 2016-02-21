// (function(global) {
  'use strict';
  module.exports = function(socket) {
    let tempSocket = socket;
    console.log('client connected');

    socket.emit('getUserIdAfterDisconnection');

    socket.on('sendUserIdAfterDisconnection', function(id) {
      console.log(id);
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
      console.log('completed');
      tempSocket.to(data.otherID).emit('completed', data);
    });

    socket.on('add_ice_candidate', function(data) {
      console.log('add_ice_candidate');
      console.log(data);
      // console.log(clients[data.otherID]);
      // clients[data.otherID].emit('receiving_ice_candidate', data);
      tempSocket.to(data.otherID).emit('receiving_ice_candidate', data);
    });

    socket.on('making_a_call', function(data) {
      console.log('making_a_call');
      console.log(data);
      tempSocket.to(data.otherID).emit('receiving_a_call', data);
      // clients[data.otherID].emit('receiving_a_call', data);
      // socket.broadcast.to(socket.id).emit('receive_message', data);
    });

    socket.on('makingAnAnswer', function(data) {
      tempSocket.to(data.otherID).emit('receivingAnAnswer', data);
    });

    socket.on('rejectFromCaller', function(data) {
      console.log('rejectFromCaller');
      console.log(data);
      tempSocket.to(data.otherID).emit('rejectFromCaller', data);
    });

    socket.on('rejectFromCallee', function(data) {
      console.log('rejectFromCallee');
      console.log(data);
      tempSocket.to(data.otherID).emit('rejectFromCallee', data);
    });

    socket.on('callee_is_ringing', function(data) {
      // clients[data.otherID].emit('callee_is_ringing');
      tempSocket.to(data.otherID).emit('calleeIsRinging', data);
    });

    socket.on('calleeIsRingingAccepted', function(data) {
      tempSocket.to(data.otherID).emit('calleeIsRingingAccepted');
    });

    /*set the socket*/
    socket.on('initializeRoomConnection', function(data) {
      console.log('initializeRoomConnection');
      console.log(data);
      let otherUserId   = data.otherUserId.toString().trim();
      let currentUserId = data.currentUserId.toString().trim();
      socket.join(data.otherUserId);

      socket_io.to(currentUserId).emit('initializeRoomConnection', data);
      socket_io.to(otherUserId).emit('initializeRoomConnection', data);
      // socket.in(otherUserId).emit('initializeRoomConnection', data);
      // socket.in(currentUserId).emit('initializeRoomConnection', data);
      // socket.to(data.currentUserId.toString().trim()).emit('initializeRoomConnection', data);

    });

    // socket.on('joinRoom', function(data) {
    //   console.log('joinRoom');
    //   socket.join(data.roomId);
    //   // socket_io.sockets.in(data.currentUserId).emit('joinRoom', data);
    //
    //     let id = data.currentUserId.toString().trim();
    //     socket_io.to(id).emit('joinRoom', data);
    //     console.log('socket.userId');
    //     console.log(socket.userId);
    //
    // });

    socket.on('joinRoom', function(data) {
      socket.join(data.roomId);

      /*send the message here*/
      console.log('sendMessage');
      console.log(data);

      let message = {};

      message.message = data.message;
      message.id      = data.currentUserId;

      console.log(message);
      setTimeout(function() {
        socket_io.to(data.roomId).emit('sendMessage', message);
      }, 0);
    });

    socket.on('sendMessage', function(data) {
      console.log('sendMessage');
      console.log(data);

      let message = {};

      message.message = data.message;
      message.id      = data.currentUserId;

      if (!!!data.room) {
        console.log('FALSE');
        tempSocket.to(data.otherUserId).emit('sendMessage', message);
        socket.emit('sendMessage', message);
      } else {
        tempSocket.to(data.roomId).emit('sendMessage', message);
        socket.emit('sendMessage', message);
      }
    });

    /* message tool */
    socket.on('joinUserCurrentRoom', function(data) {
      let message = {};
      socket.join(data.roomId);
      clients[socket.id].join(data.roomId);
      // console.log('other User Id');
      // console.log(data.otherUserId);
      // console.log(clients[data.otherUserId]);
      // console.log(clients);
      if (!clients[data.otherUserId]) {
        message.message = data.message;
        message.id     = socket.id;
        clients[socket.id].emit('sendMessage', message);
      } else {
        message.message = data.message;
        message.id     = socket.id;
        clients[socket.id].emit('sendMessage', message);
        console.log('joinOtherUserRoom');
        clients[data.otherUserId].emit('joinOtherUserRoom', {
          message : data.message,
          roomId  : data.roomId,
          id      : socket.id
        });
      }
    });

    socket.on('joinOtherUserRoom', function(data) {
      let message = {};
      clients[socket.id].join(data.roomId);
      message.message = data.message;
      message.id      = data.id;
      /*emit the message*/

      console.log('joinOtherUserRoom');
      // socket.broadcast.to(data.roomId).emit('sendMessage', message);
      clients[socket.id].emit('sendMessage', message);
    });

    // socket.on('sendMessage', function(data) {
    //   console.log('sendMessage');
    //   console.log(data);
    //   let message = {};
    //   message.message = data.message;
    //   message.id      = data.id;
    //   /*emit the message*/
    //   clients[socket.id].emit('sendMessage', message);
    //   socket.broadcast.to(data.roomId).emit('sendMessage', message);
    // });
  };
// }(global));
