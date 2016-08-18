'use strict';

function __jsonpCallback(url, call) {
  var scriptEl = document.createElement('script');
  document.body.appendChild(scriptEl);
  scriptEl.src = url + '?callback=' + call;
}

var pictures = [];
var getPictures = function(data) {
  pictures = data;
};

__jsonpCallback('http://localhost:1506/api/pictures', getPictures);


