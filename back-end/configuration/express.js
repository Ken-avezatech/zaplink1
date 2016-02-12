(function() {
  'use strict';

  /*Express Configuration*/
  module.exports = function(app) {
    app.set('x-powered-by', false);
    app.set('port', io.port);
    app.set('env', io.environment);
    app.use(io.compression());
    app.use(io.logger('dev'));
    app.use(io.bodyParser.urlencoded({
      extended: true,
      limit: '50mb'
    }));
    app.use(io.bodyParser.json({
      limit: '50mb'
    }));
    app.use(io.methodOverride(function(req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
    }));

    app.set('json spaces', 2);
    app.set('view cache', true);
    app.use(function(req, res, next) {
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      next();
    });

    /*Setup for CORS*/
    app.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
      next();
    });
  };
}());
