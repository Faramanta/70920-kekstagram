'use strict';


module.exports = function __jsonpCallback(url, call) {
    var scriptEl = document.createElement('script');
    document.body.appendChild(scriptEl);
    scriptEl.src = url + '?callback=' + call;
  };



