var vows = require('vows');
var assert = require('assert');
var util = require('util');
var uber = require('passport-uber');


vows.describe('passport-uber').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(uber.version);
    },
  },
  
}).export(module);