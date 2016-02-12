(function() {
  'use strict';

  let app  = io.express();

  app.route('/chats/list')
    .get(function(req, res, next) {
      let UserMessages   = new io.User_Messages(req, res, next);

      UserMessages
        .list()
        .then(function(list) {
          res.json(list);
        })
        .catch(function(error) {
          res.status(406).send(error);
        });
    });

    app.route('/message/list')
      .get(function(req, res, next) {
        let UserMessages   = new io.User_Messages(req, res, next);

        UserMessages
          .messageList()
          .then(function(list) {
            res.json(list);
          })
          .catch(function(error) {
            res.status(406).send(error);
          });
      });

  module.exports = app;
}());
