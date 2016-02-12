(function() {
  'use strict';

  var app = io.express();

  app.route('/plan/:token')
    .put(function(req, res, next) {
      let User_Stripe = new io.User_Stripe(req, res, next);

      User_Stripe.put()
        .then(function(data) {
          res.json(data);
        });
    });

  module.exports = app;
}());
