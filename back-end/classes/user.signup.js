(function() {
  'use strict';

  let USER = require('./user');

  class User_Signup extends USER {
    constructor(req, res, next) {
      super();
      this.req = req;
      this.res = res;
      this.next = next;
    }

    post() {
      let self = this;
      return new Promise(function(resolve, reject) {
        let email      = self.req.body.email,
            password   = self.req.body.password,
            err        = null;
        if (io._.isEmpty(email) || io._.isEmpty(password)) {
          err         = new Error('Invalid Username or Password');
          err.status  = 401;
          return reject(err);
        }

        /* Save the data */
        let data = {};
        User_Signup
          .saveOneUponSignup(self)
          .then(function(user) {
            data.user = user;
            return User_Signup.createToken(user);
          })
          .then(function(token) {
            data.token = token;
            resolve(data);
          })
      });
    }

    static createToken(user) {
      return new Promise(function(resolve, reject) {
        var payload = {
          sub: user._id.toString(),
          exp: io.moment().add(5, 'days').unix()
        };

        var token = io.jwt.encode(payload, 'shhh..');
        resolve(token);
      });
    }

    static saveOneUponSignup(options) {
      return new Promise(function(resolve, reject) {
        var query = options.req.body;

        var user = new io.User({
          email       : query.email,
          password    : query.password,
          firstName   : query.firstName,
          lastName    : query.lastName,
          displayName : query.displayName,
          birthdate   : query.birthdate
        });

        user.save();

        user.save(function(err) {
          if (err) {
            return reject(err);
          }

          resolve(user);
        });
      });
    }
  }

  module.exports = User_Signup;
}());
