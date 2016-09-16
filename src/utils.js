'use strict';

define(function() {
  return {
    inherit: function(child, parent) {
      var EmptyConstructor = function() {};
      EmptyConstructor.prototype = parent.prototype;
      child.prototype = new EmptyConstructor();
    }
  };
});
