YUI.add('test', function(Y) {


/**
 * Enter a description for the test module
 * @module test
 */

/**
 * Enter a description for the test class
 * @class test
 * @constructor
 */
test = function() {};

test.prototype = {

  /**
   * Just a dummy method
   */
  someFunc: function() {
      return true;
  }
  
};

Y.test = test;


}, '@VERSION@' );
