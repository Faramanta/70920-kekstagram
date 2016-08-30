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

  var getPictureElement = function(data) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

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

  //конструктор
  var Picture = function(data, picture, keyPicture) {
    var self = this;
    this.data = data;
    this.element = picture;
    this.key = keyPicture;

    //обработчик клика по блоку с фотографией
    this.element.onclick = function(event) {
      event.preventDefault();
      gallery.show(self.key);
    };

    //метод, который удаляет обработчики событий
    this.remove = function() {
      self.picture.onclick = null;
    };
  };

  return {
    getPictureElement: getPictureElement,
    Picture: Picture
  };
});
