'use strict';

define(['./gallery'], function(gallery) {

  var IMAGE_LOAD_TIMEOUT = 10000;

  var templateElement = document.querySelector('#picture-template');
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  define(function() {
    return function(data, container, keyPicture) {
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

      //обработчик клика по блоку с фотографией
      element.onclick = function() {
        gallery.show(keyPicture);

      };

      return element;
    };
  });
});
