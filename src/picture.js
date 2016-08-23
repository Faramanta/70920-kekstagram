'use strict';
var IMAGE_LOAD_TIMEOUT = 10000;

var templateElement = document.querySelector('#picture-template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

define(function() {
  return function(data, container) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;
    container.appendChild(element);

    var backgroundImage = new Image();
    var backgroundLoadTimeout;

  // обработчик успешной загрузки
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
});
