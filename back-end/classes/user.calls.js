(function() {
  'use strict';

  class UserCalls extends User{
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
  }

  module.exports = UserCalls;
}());
