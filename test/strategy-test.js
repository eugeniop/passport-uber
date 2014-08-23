var vows = require('vows');
var assert = require('assert');
var util = require('util');
var uberStrategy = require('passport-uber/strategy');


vows.describe('uberStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new uberStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named uber': function (strategy) {
      assert.equal(strategy.name, 'uber');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new uberStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2._request = function(method, url, headers, postData, accessToken, callback) {
        var body = '{\
            "first_name": "Uber",\
            "last_name": "Developer",\
            "email": "developer@uber.com",\
            "picture": "https://picture", \
            "promo_code": "teypo", \
            "uuid": "123" \
          }';

        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'uber');
        assert.equal(profile.id, '123');
        assert.equal(profile.displayName, 'Uber Developer');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new uberStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2._request = function(method, url, headers, postData, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },
  
}).export(module);