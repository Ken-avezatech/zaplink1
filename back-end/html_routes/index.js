(function() {
  'use strict';

  var router = io.express.Router();

  router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

  router.get('*', function(req, res) {
    if (process.env.NODE_ENV === 'production') {
      res.render('index.html');
    } else {
      res.render('index.html');
    }

  });

  module.exports = router;
})();
