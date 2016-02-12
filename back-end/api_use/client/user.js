(function() {
  'use strict';

  let app = io.express();

  app.route('/add/contact')
    .post(function(req, res, next) {
      let User = new io.USER(req, res, next);

      User
        .addContact()
        .then(function(contact) {
          res.json(contact);
        })
        .catch(function(error) {
          res.status(406).send(error);
        })
    });

  app.route('/profile/photo')
    .post(function(req, res, next) {
      let User = new io.USER(req, res, next);

      User
        .addPhoto()
        .then(function(photo) {
          res.json(photo);
        })
        .catch(function(error) {
          res.status(406).send(error);
        })
    });

  app.route('/profile/info')
    .post(function(req, res, next) {
      let User = new io.USER(req, res, next);

      User
        .profileInfo()
        .then(function(user) {
          res.json(user);
        })
        .catch(function(error) {
          res.status(406).send(error);
        })
    });

  app.route('/send/code')
    .post(function(req, res, next) {
      let User = new io.USER(req, res, next);

      User
        .sendCode()
        .then(function(data) {
          res.json(data);
        })
        .catch(function(error) {
          res.status(406).send(error);
        })
    });

  app.route('/token/id')
    .get(function(req, res, next) {
      let User = new io.USER(req, res, next);

      User
        .id()
        .then(function(data) {
          res.json(data);
        })
        .catch(function(error) {
          console.log(error);
          res.status(406).send(error);
        })
    });

  app.route('/verify/code')
    .post(function(req, res, next) {
      let User = new io.USER(req, res, next);

      User
        .verifyCode()
        .then(function(data) {
          res.json({
            message : 'Verification Code',
            status  : 200
          })
        })
        .catch(function(error) {
          res.status(406).send(error);
        })
    })

  app.route('/number/authenticate')
    .get(function(req, res, next) {
      let User = new io.USER(req, res, next);

      User
        .numberAuthenticate()
        .then(function(data) {
          res.json(data);
        });
    });

  // app.route('/email/check')
  //   .get(function(req, res, next) {
  //     let User = new io.USER(req, res, next);
  //
  //     User
  //       .check_email()
  //       .then(function(user) {
  //         if (user) {
  //           res.json({
  //             message : 'Email Check',
  //             status  : 200,
  //             data    : {
  //               user : user
  //             }
  //           });
  //         } else {
  //           res.json({
  //             message : 'Email Check',
  //             status  : 200,
  //             data    : {
  //               user : null
  //             }
  //           });
  //         }
  //       });
  //   });

  module.exports = app;
}());
