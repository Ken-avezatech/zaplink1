(function() {
  'use strict';

  class User_Stripe {
    constructor(req, res, next) {
      this.req = req;
      this.res = res;
      this.next = next;
    }

    put() {
      let self = this;
      return new Promise(function(resolve, reject) {
        let query       = io.url.parse(self.req.url, true).query;
        let stripeToken = self.req.params.token;
        let plan        = query.plan;

        if(!stripeToken) {
          return reject(new Error('Please provide a valid card.'));
        }

        let token     = self.req.headers.authorization.split(' ')[1];
        let userObj   = io.jwt.decode(token, 'shhh..');

        io.User.findById(userObj.sub, function(err, user) {
          if (err) {return next(err);}

          user.setCard(stripeToken, function(err) {
            if (err) {
              var error;
              if(err.code && err.code === 'card_declined'){
                error         = new Error('Your card was declined. Please provide a valid card');
                error.status  = 200;
                return reject(error);
              }
              error         = new Error('An unexpected error occurred.');
              error.status  = 200;
              return reject(error);
            }

            /*set the plan*/
            User_Stripe.plan(stripeToken, plan, user)
              .then(function(response) {
                resolve(response);
              });
          });
        });
      });
    }

    static plan(stripeToken, plan, user) {
      return new Promise(function(resolve, reject) {

        if(plan){
          plan = plan.toLowerCase();
        }

        io.User.findById(user.id, function(err, user) {
          if (err) {return reject(err);}

          user.setPlan(plan, stripeToken, function (err) {
            var msg;

            if (err) {
              if(err.code && err.code === 'card_declined'){
                msg = 'Your card was declined. Please provide a valid card.';
              } else if(err && err.message) {
                msg = err.message;
              } else {
                msg = 'An unexpected error occurred.';
              }

              return reject(err);
            }

            return resolve(user);
          });
        });
      });
    }
  }

  module.exports = User_Stripe;
}());
