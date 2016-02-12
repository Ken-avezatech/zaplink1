(function() {
  'use strict';

  let app  = io.express();

  app.route('/contacts/list')
    .get(function(req, res, next) {
      let UserContacts   = new io.User_Contacts(req, res, next);

      UserContacts
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
