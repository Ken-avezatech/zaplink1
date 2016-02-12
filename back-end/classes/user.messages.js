(function() {
  'use strict';

  class UserMessages extends User{
    constructor(req, res, next) {
      super(req, res, next);
      this.req = req;
      this.res = res;
      this.next = next;
    }

    list() {
      let self = this;
      let query = io.url.parse(self.req.url, true).query;

      return new Promise(function(resolve, reject) {
        UserMessages
          .token(self)
          .then(function(id) {
            io.User
              .findById(id)
              .deepPopulate('rooms.members rooms.messages')
              .exec()
              .then(function(list) {
                /*compare the last message created date*/
                resolve({
                  message     : 'Getting the list of Chats',
                  status      : 200,
                  data        : list,
                  currentUser : id
                });
              });
          })
      });
    }

    messageList() {
      let self = this;
      let query = io.url.parse(self.req.url, true).query;

      return new Promise(function(resolve, reject) {
        UserMessages
          .token(self)
          .then(function(id) {
            /*get the message for this room*/
            io.UserMessages
              .findOne({
                _creator: query.roomId,
                status  : 'today'
              })
              .exec()
              .then(function(message) {
                if (message) {
                  let now       = io.moment().format('YYYY-MM-DD');
                      now       = io.moment(new Date(now));
                  let previous  = io.moment(new Date(message.createdAt)).format('YYYY-MM-DD');
                      previous  = io.moment(new Date(previous));
                  let diff      = now.diff(previous, 'days');

                  if (diff === 1) {
                    /*query the yesterday status*/
                    io.UserMessages
                      .findOne({
                        _creator: query.roomId,
                        status  : 'yesterday'
                      })
                      .exec()
                      .then(function(yesterdayMessage) {
                        /*check the diff of the yesterday*/
                        let now       = io.moment().format('YYYY-MM-DD');
                            now       = io.moment(new Date(now));
                        let previous  = io.moment(new Date(yesterdayMessage.createdAt)).format('YYYY-MM-DD');
                            previous  = io.moment(new Date(previous));
                        let diff      = now.diff(previous, 'days');

                        return;

                        if (diff === 2) {
                          /*set the today message to old also no yesterday status anymore*/

                          /*save the changes for status*/
                          yesterdayMessage.status = 'old';
                          message.status  = 'old';
                          message.save();
                          yesterdayMessage.save();

                          /*query the messageList*/
                          io.UserMessages
                            .find({
                              _creator: query.roomId,
                            })
                            .exec()
                            .then(function(messageList) {
                              resolve({
                                message : 'Message',
                                status  : 200,
                                data    : messageList
                              });
                            });

                          return;
                        }

                        /*save the changes for status*/
                        yesterdayMessage.status = 'old';
                        message.status  = 'yesterday';
                        message.save();
                        yesterdayMessage.save();

                        /*query the messageList*/
                        io.UserMessages
                          .find({
                            _creator: query.roomId,
                          })
                          .exec()
                          .then(function(messageList) {
                            resolve({
                              message : 'Message',
                              status  : 200,
                              data    : messageList
                            });
                          });
                      });
                  } else {
                    /*meaning we have today's message status*/
                    io.UserMessages
                      .find({
                        _creator: query.roomId,
                      })
                      .exec()
                      .then(function(messageList) {
                        resolve({
                          message : 'Message',
                          status  : 200,
                          data    : messageList
                        });
                      });
                  }
                } else {
                  /*meaning we have today message and it is the diff === 0*/
                  /*query the today's message*/

                  io.UserMessages
                    .findOne({
                      _creator: query.roomId,
                      status  : 'yesterday'
                    })
                    .exec()
                    .then(function(yesterday) {
                      if (yesterday) {
                        /*check the diff of the yesterday*/
                        let now       = io.moment().format('YYYY-MM-DD');
                            now       = io.moment(new Date(now));
                        let previous  = io.moment(new Date(yesterday.createdAt)).format('YYYY-MM-DD');
                            previous  = io.moment(new Date(previous));
                        let diff      = now.diff(previous, 'days');

                        if (diff === 2) {
                          /*save the changes for status*/
                          yesterday.status = 'old';
                          yesterday.save();

                          io.UserMessages
                            .find({
                              _creator: query.roomId,
                            })
                            .exec()
                            .then(function(messageList) {
                              resolve({
                                message : 'Message',
                                status  : 200,
                                data    : messageList
                              });
                            });
                        } else {
                          io.UserMessages
                            .find({
                              _creator: query.roomId,
                            })
                            .exec()
                            .then(function(messageList) {
                              resolve({
                                message : 'Message',
                                status  : 200,
                                data    : messageList
                              });
                            });
                        }
                      } else {
                        io.UserMessages
                          .find({
                            _creator: query.roomId,
                          })
                          .exec()
                          .then(function(messageList) {
                            resolve({
                              message : 'Message',
                              status  : 200,
                              data    : messageList
                            });
                          });
                      }
                    });
                }
              });
          });
      });
    }
  }

  module.exports = UserMessages;
}());
