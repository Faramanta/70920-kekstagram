'use strict';

define(['./gallery', './base-component', './utils'], function(gallery, BaseComponent, utils) {

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
    this.data = data;
    this.key = keyPicture;

    BaseComponent.call(this, getPictureElement(data));

    this.onClick = this.onClick.bind(this);
    this.element.addEventListener('click', this.onClick);
  };

  utils.inherit(Picture, BaseComponent);

  //обработчик клика по блоку с фотографией
  Picture.prototype.onClick = function(event) {
    event.preventDefault();
    gallery.show(this.key);
  };

  //удаляение обработчиков событий
  Picture.prototype.remove = function() {
    this.element.removeEventListener('click', this.onClick);
    BaseComponent.prototype.remove.call(this);
  };

  return {
    getPictureElement: getPictureElement,
    Picture: Picture
  };
});
