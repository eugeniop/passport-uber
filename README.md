# Passport-uber

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [uber](http://www.uber.com/) using the OAuth 2.0 API.

This module lets you authenticate using uber in your Node.js applications.
By plugging into Passport, uber authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-uber

## Usage

#### Configure Strategy

The uber authentication strategy authenticates users using a uber account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a consumerKey, consumerSecret, and callback URL.

    passport.use(new uberStrategy({
        clientID: ID,
        clientSecret: SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/uber/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ uberid: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'uber'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/uber',
      passport.authenticate('uber'));

    app.get('/auth/uber/callback', 
      passport.authenticate('uber', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Tests

    $ npm install --dev
    $ make test

## Credits

  - [Eugenio Pace](http://github.com/eugeniop)
  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2014 Eugenio Pace