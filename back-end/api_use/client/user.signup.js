(function() {
  'use strict';

  var app = io.express();

  app.route('/signup')
    .post(function(req, res, next) {
      let User_Signup   = new io.User_Signup(req, res, next);
      User_Signup.post()
        .then(function(data) {
          res.json(data);
        })
        .catch(function(err) {
          res.json({error: err});
        })
    });

  module.exports = app;
}());
