(function() {
  'use strict';

  module.exports = function(req, res, next) {
   if (req.headers.authorization) {
      req.isAuthenticated = true;
      var token = req.headers.authorization.split(' ')[1];
      var user  = io.jwt.decode(token, 'shhh..');
      next(user);
    } else {
      req.isAuthenticated = false;
      var err     = new Error('Unauthorized Routes');
      err.status  = 200;
      return next(err);
    }
  };
}());
