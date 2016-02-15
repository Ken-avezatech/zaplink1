(function() {
  'use strict';

  var path      = require('path'),
      mongoose  = require('mongoose'),
      Promise   = require('bluebird'),
      rootPath  = path.normalize(__dirname + '/../../'),
      service   = '../services/';

  module.exports = {
    rootPath          : rootPath,
    authorize         : require(service + 'authorize'),
    clusterService    : require(service + './cluster'),
    socket            : require(service + './socket'),
    config            : require('./settings.config'),
    mongoDB           : require('../configuration/mongodb'),
    use_app           : require('./use_app.config'),
    use_api           : require('./use_api.config'),

    bodyParser        : require('body-parser'),
    chalk             : require('chalk'),
    cluster           : require('cluster'),
    compression       : require('compression'),
    express           : require('express'),
    http              : require('http'),
    jwt               : require('jwt-simple'),
    logger            : require('morgan'),
    methodOverride    : require('method-override'),
    moment            : require('moment'),
    mongoose          : Promise.promisifyAll(mongoose),
    numCPUs           : require('os').cpus().length,
    twilio            : require('twilio')('AC8c5399f2677eeba0739034677e506440', 'bf3fff39aa088fbb9eae2785446d42a1'),
    LookupsClient     : require('twilio').LookupsClient,
    url               : require('url'),

    port              : process.env.PORT || 3003,
    environment       : process.env.NODE_ENV || 'development',

    /* Models */
    User            : require('../model/User'),
    UserContacts    : require('../model/User._Contacts'),
    UserMessages    : require('../model/User._Messages'),
    UserRooms       : require('../model/User._Rooms'),

    /* Classes */
    USER              : require('../classes/user.js'),
    User_Calls        : require('../classes/user.calls'),
    User_Contacts     : require('../classes/user.contacts.js'),
    User_Messages     : require('../classes/user.messages'),
    User_Signup       : require('../classes/user.signup'),
    User_Stripe       : require('../classes/user.stripe'),
    User_Rooms        : require('../classes/user.rooms'),
    User_Login        : require('../classes/user.login')
  };
}());
