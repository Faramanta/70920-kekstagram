'use strict';

define(function() {
  return function(url, call) {
    var scriptEl = document.createElement('script');
    document.body.appendChild(scriptEl);
    scriptEl.src = url + '?callback=' + call;
  };
});

