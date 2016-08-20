'use strict';

var IMAGE_LOAD_TIMEOUT = 10000;

var pictures = [];

window.getPictures = function(data) {
  pictures = data;
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

function __jsonpCallback(url, call) {
  var scriptEl = document.createElement('script');
  document.body.appendChild(scriptEl);
  scriptEl.src = url + '?callback=' + call;
}

__jsonpCallback('http://localhost:1506/api/pictures', 'getPictures');

//скрыть фильтры
function filterHidden() {
  var filter = document.querySelector('.filters');

  if (!filter.classList.contains('hidden')) {
    filter.classList.add('hidden');
  }
}

filterHidden();

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('#picture-template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

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
    element.classList.add('picture-load-failure');
  };

  backgroundImage.src = data.url;

  //таймер
  backgroundLoadTimeout = setTimeout(function() {
    backgroundImage.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  return element;
};

function filterBlock() {
  var filter = document.querySelector('.filters');

  if (filter.classList.contains('hidden')) {
    filter.classList.remove('hidden');
  }
}
filterBlock();



