(function() {
  'use strict';

  let mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;

  var UserContactsSchema = new mongoose.Schema({
    _creator  : {
      type: Schema.Types.ObjectId,
      ref : 'User'
    }
  });

  module.exports = mongoose.model('UserContacts', UserContactsSchema);
}());
