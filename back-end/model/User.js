(function() {
  'use strict';

  var bcrypt    = require('bcrypt-nodejs'),
      mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;

  var crypto          = require('crypto');
  var timestamps      = require('mongoose-timestamp');

  var UserSchema = new mongoose.Schema({
    firstName   : String,
    lastName    : String,
    birthdate   : Date,
    photo       : String,
    socket      : {},
    phone       : {
      number  : {
        type  : Number,
        unique: true
      },
      verificationCode: {
        type: Number
      },
      status: {
        type    : String,
        default : 'pending'
      }
    },
    password    : String,
    contacts    : [{
      type  : Schema.Types.ObjectId,
      ref   : 'User'
    }],
    rooms       : [{
      type  : Schema.Types.ObjectId,
      ref   : 'UserRooms'
    }]
  });

  UserSchema.plugin(timestamps);

  UserSchema.pre('save', function(next) {
    var user = this;

   if (!user.isModified('password')) {return next();}


    bcrypt.genSalt(10, function(err, salt) {
     if (err) {return next(err);}
      bcrypt.hash(user.password, salt, null, hashPassword);
    });

    function hashPassword(err, hash) {
     if (err) {
        return next (err);
      }
      user.password = hash;
      next();
    }
  });

  UserSchema.methods.toJSON = function() {
    var user = this.toObject();
    delete user.password;

    return user;
  };

  UserSchema.methods.comparePasswords = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
  };


  /**
   * Get URL to a user's gravatar.
   * Used in Navbar and Account Management page.
   */

  UserSchema.methods.gravatar = function(size) {
    if (!size) {size = 200;}

    if (!this.email) {
      return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    }

    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
  };

  UserSchema.methods.fullName = function() {
    if (!this.email) {
      return this.firstName + ' ' + this.lastName;
    }
  };

  var deepPopulate = require('mongoose-deep-populate')(mongoose);
  UserSchema.plugin(deepPopulate, {});

  module.exports = mongoose.model('User', UserSchema);
}());
