(function() {
  'use strict';

  var router  = io.express.Router();

  router.get('/client/stripe/index.html', function(req, res) {
    res.render('client/stripe/index.html');
  });

  module.exports = router;
}());
