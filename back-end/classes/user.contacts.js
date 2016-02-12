(function(global) {
  'use strict';

  class UserContacts extends User{
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
        UserContacts
          .token(self)
          .then(function(id) {
            io.User
              .findById(id)
              .populate('contacts', 'firstName lastName photo')
              .exec()
              .then(function(list) {
                list = list.contacts;
                resolve({
                  message : 'Contacts List',
                  status  : 200,
                  data    : list
                });
              });
          })
      });
    }
  }

  module.exports = UserContacts;
}(global));
