(function() {
  'use strict';

  let USER = require('./user');

  class User_Login extends USER {
    constructor(req, res, next) {
      super();
      this.req = req;
      this.res = res;
      this.next = next;
    }

    post() {
      let self = this;
      return new Promise(function(resolve, reject) {
        io.User
          .findOne({
            email: self.req.body.email
          }, function(err, user) {
            if (err) {return reject(err);}
            if (!user) {
              err         = new Error('Invalid Email');
              err.status  = 401;
              return reject(err);
            }

            user.comparePasswords(self.req.body.password, function(err, isMatch) {
              if (err) {return reject(err);}
              if (!isMatch) {
                err         = new Error('Invalid Password');
                err.status  = 401;
                return reject(err);
              }

              User_Login.createToken(user)
                .then(function(token) {
                  resolve({
                    gravatar: user.gravatar(25),
                    user  : user.toJSON(),
                    token : token
                  });
                }).catch(function(err) {
                  reject(err);
                });
            });
          });
      });
    }
  }

  module.exports = User_Login;
}());
