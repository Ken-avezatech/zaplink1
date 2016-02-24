(function() {
  'use strict';

  class UserRooms extends User {
    constructor(req, res, next) {
      super(req, res, next);
      this.req = req;
      this.res = res;
      this.next = next;
    }

    createRoom() {
      let self  = this;
      let query = self.req.body;

      return new Promise(function(resolve, reject) {
        User
          .token(self)
          .then(function(id) {
            /*check if this user already have a history room*/
            io.UserRooms
              .findOne({members: {
                $all: [id, query.otherContactId]
              }})
              .exec()
              .then(function(room) {
                if (room) {
                  /*save the message first*/
                  /*before saving the message test the status if it is*/
                  /* today | yesterday | date*/
                  io.UserMessages
                    .findOne({
                      _creator: room._id,
                      status  : 'today'
                    })
                    .exec()
                    .then(function(nowMessage) {
                      /*test if we have nowMessage meaning*/
                      /*there is not messag attached for today for many days or so*/
                      if (!nowMessage) {
                        /*meaning no today for this errand*/
                        let message = io.UserMessages({
                          _creator: room._id,
                          message : query.message,
                          id      : id,
                          status  : 'today'
                        });

                        room.messages = message._id;
                        message.save();
                        room.save()

                        resolve({
                          message : 'Saving the message',
                          status  : 200,
                          roomId  : room._id
                        });

                        return;
                      }

                      /*compare the createdAt and moment now*/
                      let now       = io.moment().format('YYYY-MM-DD');
                          now       = io.moment(new Date(now));
                      let previous  = io.moment(new Date(nowMessage.createdAt)).format('YYYY-MM-DD');
                          previous  = io.moment(new Date(previous));
                      let diff      = now.diff(previous, 'days');

                      if (diff === 1) {
                        /*get the yesterday status before saving*/
                        /*then change the status to its date(createdAt)*/
                        io.UserMessages
                          .findOne({
                            _creator: room._id,
                            status  : 'yesterday'
                          })
                          .exec()
                          .then(function(yesterdayMessage) {
                            if (yesterdayMessage) {
                              yesterdayMessage.status = 'old';

                              yesterdayMessage.save();

                              /*change the previous message status to yesterday*/
                              nowMessage.status = 'yesterday';
                              nowMessage.save();

                              /*change the recent message status to today*/
                              /*save the message*/
                              let message = io.UserMessages({
                                _creator: room._id,
                                message : query.message,
                                id      : id,
                                status  : 'today'
                              });

                              message.save();
                              room.messages = message._id;
                              room.save()

                              resolve({
                                message : 'Saving the message',
                                status  : 200,
                                roomId  : room._id
                              });
                            } else {
                              /*meaning we dont have any yesterday messages yet*/
                              nowMessage.status = 'yesterday';
                              nowMessage.save();

                              /*change the recent message status to today*/
                              /*save the message*/
                              let message = io.UserMessages({
                                _creator: room._id,
                                message : query.message,
                                id      : id,
                                status  : 'today'
                              });

                              message.save();
                              room.messages = message._id;
                              room.save()

                              resolve({
                                message : 'Saving the message',
                                status  : 200,
                                roomId  : room._id
                              });
                            }
                          });
                      } else if (diff === 0) {
                        /*meaning the room has only today message*/
                        /*save the message*/
                        /*we will not specify here the status because it is in the else clause*/
                        /*which will be defaulted to null*/
                        let message = io.UserMessages({
                          _creator: room._id,
                          message : query.message,
                          id      : id
                        });

                        message.save();

                        /*save the last message for this room*/
                        room.messages = message._id;
                        room.save();

                        /*get the message for this room*/
                        io.UserMessages
                          .find({
                            _creator: room._id
                          })
                          .exec()
                          .then(function(messageList) {

                            resolve({
                              message : 'Message',
                              status  : 200,
                              roomId  : room._id
                            });
                          });
                      }
                    });
                } else {
                  /*create a room*/
                  let room = io.UserRooms({
                    _creator: id,
                  });

                  // setTimeout(function() {
                  //   gsocket.join(room._id);
                  // }, 0);

                  // setTimeout(function() {
                  //   gsocket.to(query.otherContactId).emit('joinRoom', {
                  //     currentUserId : id,
                  //     otherUserId   : query.otherContactId,
                  //     roomId        : room._id,
                  //     message       : query.message,
                  //     status        : 'socket_io.in'
                  //   });
                  // }, 0);

                  /*emit the otherContactId*/

                  room.members.push(id);
                  room.members.push(query.otherContactId);

                  /*save the message*/
                  let message = io.UserMessages({
                    _creator: room._id,
                    message : query.message,
                    id      : id,
                    status  : 'today'
                  });

                  room.messages = message._id;

                  room.save();
                  message.save();

                  /*save room for the otherUser*/
                  io.User
                    .findById(query.otherContactId)
                    .exec()
                    .then(function(user) {
                      user.rooms.push(room._id);

                      user.save();
                    });

                  io.User
                    .findById(id)
                    .exec()
                    .then(function(user) {
                      user.rooms.push(room._id);

                      user.save();
                    });

                  resolve({
                    message : 'Chats',
                    status  : 200,
                    roomId  : room._id
                  });
                }
              });
          });
      });
    }
  }



  module.exports = UserRooms;
}());
