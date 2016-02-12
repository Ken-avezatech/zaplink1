(function() {
  'use strict';

  let mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;

  let timestamps      = require('mongoose-timestamp');

  var UserMessagesSchema = new mongoose.Schema({
    _creator  : {
      type: Schema.Types.ObjectId,
      ref : 'UserRooms'
    },
    message   : String,
    status    : {
      type    : String,
      default : 'null' 
    },
    /*id is use who send the message*/
    id        : Schema.Types.ObjectId
  });

  UserMessagesSchema.plugin(timestamps);

  module.exports = mongoose.model('UserMessages', UserMessagesSchema);
}());
