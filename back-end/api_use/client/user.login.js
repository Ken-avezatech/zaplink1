(function() {
  'use strict';

  let app  = io.express();

  app.route('/login')
    .post(function(req, res, next) {
      let User_Login   = new io.User_Login(req, res, next);

      User_Login.post()
        .then(function(data) {
          res.json(data);
        })
        .catch(function(err) {
           res.json({error: err});
        });
    });

  module.exports = app;
}());
