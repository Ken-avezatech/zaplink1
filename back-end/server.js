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
  // app.use('*', catchAll);

  /*io.cluster Configuration*/
  // var sticky = require('sticky-session');


let server = io.http.createServer(app);
global.socket_io = require('socket.io')(server);

server.listen(app.get('port'), function() {
  console.log("Listening to port: " + app.get('port'));
});

global.socket_io.on('connection', io.socket);

  // if (!sticky.listen(server, io.port)) {
  //   // Master code
  //   server.on('listening', function() {
  //     console.log('server started on port ' + io.port);
  //   });
  // } else {
  //   global.socket_io = require('socket.io')(server);
  //   global.socket_io.on('connection', io.socket);
  //   console.log('worker');
  //   if (io.cluster.isMaster) {
  //     io.clusterService(io);
  //   }
  // }

  // if (io.cluster.isMaster) {io.clusterService(io);}
  // else {
  //   let server = io.http.createServer(app);
  //   let socket_io = require('socket.io')(server);
  //
  //   server.listen(io.port, function() {
  //     console.log(io.chalk.red.reset.underline('listening to port ') +
  //     io.chalk.cyan.bold((io.port)));
  //   });
  //
  //   socket_io.on('connection', function(socket) {
  //     console.log('connected');
  //   });
  // }

  /*close our connection when the app stop*/
  process.on('SIGINT', function() {
    io.mongoose.connection.close(function () {
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });
  });
}());
