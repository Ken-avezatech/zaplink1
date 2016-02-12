(function() {
  'use strict';

  let mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;

  var UserRoomsSchema = new mongoose.Schema({
    // _creator  : {
    //   type: String,
    //   ref : 'User'
    // },
    members   : [{
      type  : Schema.Types.ObjectId,
      ref   : 'User'
    }],
    messages  : {
      type  : Schema.Types.ObjectId,
      ref   : 'UserMessages'
    }
  });

  module.exports = mongoose.model('UserRooms', UserRoomsSchema);
}());
