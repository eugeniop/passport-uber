/**
 * Module dependencies.
 */
var util = require('util') 
  ,OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  ,InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The uber authentication strategy authenticates requests by delegating to
 * uber using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`    your uber application's client id
 *   - `clientSecret` your uber application's client secret
 *   - `callbackURL`    URL to which uber will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new uberStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/miiCard/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://login.uber.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://login.uber.com/oauth/token';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'uber';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from uber.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `uber`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {

  this._oauth2._request('GET', 'https://api.uber.com/v1/me', 
                        {Authorization: "Bearer " + accessToken },
                        null, 
                        accessToken, 
                        function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {

      var json = JSON.parse(body);
      
      var profile = { provider: 'uber' };
      profile.id = json.uuid;
      profile.displayName = json.first_name + " " + json.last_name;
      
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
