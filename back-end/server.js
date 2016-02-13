(function() {
  'use strict';

  global.appRequire = function(name) {
    return require(__dirname + '/' + name);
  };

  global.User     = appRequire('classes/user.js');
  global.io       = appRequire('configuration/module.config');

  // var  catchAll  = require('./html_routes');

  /*Configuration File NoSQL Database*/
  require('./configuration/mongodb')(io.config.dbName, io); //mongodb integration

  /*Start our Express Server*/
  let app = io.express();

  /*Require our Configuration Files*/
  require('./configuration/express')(app);

  /*Routes*/
  io.use_app(app, io);
  io.use_api(app, io);
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send({
      message: err.message,
      status: err.status || 500
    });
  });

  /*io.cluster Configuration*/
  var sticky = require('sticky-session');

  let server = io.http.createServer(app);
  global.socket_io = require('socket.io')(server, {pingTimeout: 3000, pingInterval: 3000});

  if (!sticky.listen(server, io.port)) {
    server.once('listening', function() {
      console.log('server started on port ' + io.port);
    });
  } else {
    console.log('worker');
    global.socket_io.on('connection', io.socket);
  }

  /*close our connection when the app stop*/
  process.on('SIGINT', function() {
    io.mongoose.connection.close(function () {
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });
  });
}());
