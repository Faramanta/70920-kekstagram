'use strict';

function __jsonpCallback(url, call) {
  var scriptEl = document.createElement('script');
  document.body.appendChild(scriptEl);
  scriptEl.src = url + '?callback=' + call;
}

window.getPictures = function(data) {
  window.pictures = data;
};

//var pictures = [];
//var getPictures = function(data) {
//  pictures = data;
//};

function filterHidden() {
  var filter = document.querySelector('.filters');

  if (!filter.classList.contains('hidden')) {
    filter.classList.add('hidden');
  }
}

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('#picture-template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var IMAGE_LOAD_TIMEOUT = 10000;

var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;
  container.appendChild(element);

  var backgroundImage = new Image();
  var backgroundLoadTimeout;

  //обработчик успешной загрузки
  backgroundImage.onload = function(evt) {
    clearTimeout(backgroundLoadTimeout);
    element.style.backgroundImage = 'url(\'' + evt.target.src + '\')';
    element.style.backgroundSize = '182px';
  };

  //обработчик ошибки загрузки
  backgroundImage.onError = function() {
    element.classList.add('.picture-load-failure');
  };

  backgroundImage.src = data.url;

  //таймер
  backgroundLoadTimeout = setTimeout(function() {
    backgroundImage.src = '';
    element.classList.add('.picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  return element;
};

pictures.forEach(function(data) {
  getPictureElement(data, picturesContainer);
});

__jsonpCallback('http://localhost:1506/api/pictures', 'getPictures');
filterHidden();
