(function() {
  'use strict';

  var router  = io.express.Router();

  router.get('/client/main/index.html', function(req, res) {
    res.render('client/main/index.html');
  });

  module.exports = router;
}());
