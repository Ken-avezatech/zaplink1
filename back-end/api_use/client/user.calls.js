(function() {
  'use strict';

  let app  = io.express();

  app.route('/calls/list')
    .get(function(req, res, next) {
      let UserCalls   = new io.User_Calls(req, res, next);

      UserCalls
        .list()
        .then(function(list) {
          res.json(list);
        })
        .catch(function(error) {
          res.status(406).send(error);
        });
    });

  module.exports = app;
}());
