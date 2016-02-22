(function() {
  'use strict';

  class USER {
    constructor(req, res, next) {
      this.req  = req;
      this.res  = res;
      this.next = next;
    }

    addContact() {
      let self  = this;
      let query = self.req.body;

      return new Promise(function(resolve, reject) {
        USER
          .checkIfNumberIsAlreadySaved(query)
          .then(function(user) {
            let otherUser = user;
            console.log('USERRRRRRRRRRR');
            console.log(user);
            if (user) {
              USER
                .token(self)
                .then(function(id) {
                  io.User
                    .findById(id)
                    .exec()
                    .then(function(user) {
                      /*
                       * Save the contact first
                       * then saved the in to the user model
                       */
                      user.contacts.push(otherUser._id);
                      user.save();

                      // var userContact = io.UserContacts({
                      //   _creator: user._id
                      // });
                      //
                      // console.log('userContact');
                      // console.log(userContact)

                      // userContact.save();

                      /* get the data of the added user*/

                      resolve({
                        message : 'Adding Contact',
                        status  : 200,
                        data    : otherUser
                      });
                    });
                })
                .catch(function(error) {
                  reject(error);
                });
            } else {
              /*check if the number is valid*/
              USER
                .numberAuthenticate(query)
                .then(function(isMobile) {
                  if (isMobile) {
                    resolve({
                      message : 'Number is Not Yet Registered in ZapLink',
                      status  : 401
                    });
                  } else {
                    resolve({
                      message : query.phoneNumber + ' is Not a mobile Number',
                      status  : 401
                    });
                  }
                })
                .catch(function(error) {
                  reject(error);
                })
            }
          });

      });
    }

    addPhoto() {
      let self  = this;
      let query = self.req.body;

      return new Promise(function(resolve, reject) {
        USER
          .token(self)
          .then(function(id) {
            io.User
              .findById(id)
              .exec()
              .then(function(user) {
                user.photo = query.photo;

                user.save(function(error) {
                  if (error) {return reject(error);}

                  resolve({
                    message : 'Adding Profile Photo',
                    status  : 200
                  });
                });
              });
          })
          .catch(function(error) {
            reject(error);
          })
      });
    }

    id() {
      let self  = this;
      return new Promise(function(resolve, reject) {
        USER
          .token(self)
          .then(function(id) {
            /*get the user data*/
            /*for one to one video call*/
            io.User
              .findById(id)
              .exec()
              .then(function(user) {
                resolve({
                  message : 'User ID',
                  status  : 200,
                  data    : id,
                  user    : user
                });
              });
          })
          .catch(function(error) {
            reject(error);
          });
      });
    }

    profileInfo() {
      let self  = this;
      let query = self.req.body;

      return new Promise(function(resolve, reject) {
        USER
          .token(self)
          .then(function(id) {
            io.User
              .findById(id)
              .exec()
              .then(function(user) {
                user.firstName  = query.firstName;
                user.lastName   = query.lastName;
                user.birthdate  = query.birthdate;

                user.save(function(error) {
                  console.log(error);
                  if (error) {return reject(error);}
                  resolve({
                    message : 'Adding Profile Info',
                    status  : 200
                  });
                });
              });
          })
          .catch(function(error) {
            reject(error);
          })
      });
    }

    static checkIfNumberIsAlreadySaved(query) {
      return new Promise(function(resolve, reject) {
        io.User
          .findOne({
            'phone.number': parseInt(query.phoneNumber)
          })
          .exec()
          .then(function(user) {
            resolve(user);
          });
      });
    }

    static numberAuthenticate(query) {
      let self  = this;

      return new Promise(function(resolve, reject) {
        let LookupsClient   = require('twilio').LookupsClient;
        let client          = new io.LookupsClient(io.config.twilio.accountSid, io.config.twilio.authToken);

        client.phoneNumbers('+' + query.phoneNumber).get({
          type: 'carrier'
        },function(error, number) {
          if (error) {

            return reject(error);
          }
          if (number.carrier.type === 'mobile') {
            return resolve(true);
          } else {
            return resolve(false);
          }
        });
      });
    }

    static promiseWhile(condition, action) {
      let resolver = Promise.defer();

      let loop = function() {
        if (!condition()) {return resolver.resolve();}
        return Promise.cast(action())
          .then(loop)
          .catch(resolver.reject);
      };

      process.nextTick(loop);
      return resolver.promise;
    };

    sendCode() {
      let self  = this;
      let query = self.req.body;

      return new Promise(function(resolve, reject) {
        /* create the number code */
        let code = Math.floor((Math.random()*999999)+111111);

        io.User
          .findOne({
            'phone.number': query.phoneNumber
          })
          .exec()
          .then(function(user) {
            /* Test if we found user
             * so that we will not send a sms verification
             */
            if (!user) {
              console.log("USER unknown")
              io.twilio
                .messages
                .create({
                  to  : '+' + query.phoneNumber,
                  from: io.config.twilioNumber,
                  body: 'Your ZapLink Verification code is: ' + code
                }, function(error, responseData) {
                  if (error) {
                    return reject(error);
                  }//comment when testing local

                  /* save the number */
                  let user = io.User({
                    phone: {
                      number          : query.phoneNumber,
                      verificationCode: code
                    }
                  });

                  user.save(function(error) {
                    if (error) {
                      return reject(error);
                    }

                    USER.createToken(user)
                      .then(function(token) {
                        return resolve({
                          token           : token,
                          response        : responseData,//comment when testing local
                          verificationCode: code
                        });
                      });
                  });
                });//comment when testing local
            } else {
              /*test if the user is approved*/
              /**
               * we want this because to test if the user registered but
               * the user decided to close the application
               */
              if (user.phone.status === 'approved') {
                /*this will used so that the app will go to the chat tabs*/
                /**
                 * After the user clear the cache and stop the application
                 */

                 /**
                  * user phoneNumber is already use
                  * don't send phone number verification
                  */
                resolve(user);
              } else {
                /*delete the entry of the user*/
                user.remove();
                /*register the code*/
                io.twilio
                  .messages
                  .create({
                    to  : '+' + query.phoneNumber,
                    from: io.config.twilioNumber,
                    body: 'Your ZapLink Verification code is: ' + code
                  }, function(error, responseData) {
                    if (error) {
                      return reject(error);
                    }

                    /* save the number */
                    let user = io.User({
                      phone: {
                        number          : query.phoneNumber,
                        verificationCode: code
                      }
                    });

                    user.save(function(error) {
                      if (error) {
                        return reject(error);
                      }

                      USER.createToken(user)
                        .then(function(token) {
                          return resolve({
                            token           : token,
                            response        : responseData,
                            verificationCode: code
                          });
                        });
                    });
                  });
              }
            }
          });
      });
    }

    verifyCode() {
      let self = this;
      let query = self.req.body;

      return new Promise(function(resolve, reject) {
        let token = self.req.headers.authorization.split(' ')[1];
        let user  = io.jwt.decode(token, 'shhh..');

        io.User
          .findById(user.sub)
          .exec()
          .then(function(user) {
            if (user.phone.verificationCode !== query.verificationCode) {
              return reject({
                message: 'Please Input the correct Verification Code'
              });
            }

            user.phone.status = 'approved';

            user.save(function(error) {
              if (error) {
                return reject(error);
              }

              resolve('success');
            });
          });
      });
    }

    static createToken(user) {
      return new Promise(function(resolve, reject) {
        var payload = {
          sub: user._id.toString(),
          exp: io.moment().add(5, 'days').unix()
        };

        var token = io.jwt.encode(payload, 'shhh..');
        resolve(token);
      });
    }

    static token(self) {
      return new Promise(function(resolve, reject) {
        if (!!!self.req.headers.authorization) {
          return reject('failed');
        }

        let token = self.req.headers.authorization.split(' ')[1];
        let user  = io.jwt.decode(token, 'shhh..');

        return resolve(user.sub);
      });
    }
  }

  module.exports = USER;
}());
