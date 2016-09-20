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

  function getPictureElement(data) {
    var element = elementToClone.cloneNode(true);

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var image = new Image(182, 182);
    var imageLoadTimeout;

    // обработчик успешной загрузки
    image.onload = function(evt) {
      clearTimeout(imageLoadTimeout);
      element.href = evt.target.src;
      element.replaceChild(image, element.querySelector('img'));
    };

    //обработчик ошибки загрузки
    image.onError = function() {
      element.classList.add('picture-load-failure');
    };

    image.src = data.url;

    //таймер
    imageLoadTimeout = setTimeout(function() {
      element.querySelector('img').src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    return element;
  }

  //конструктор
  var Picture = function(data) {
    this.data = data;
    this.key = this.data.key;
    this.likesCount = document.querySelector('.likes-count');
    this.pictureLikes = document.querySelector('.picture-likes');

    BaseComponent.call(this, getPictureElement(this.data));

    this.onClick = this.onClick.bind(this);
    this.element.addEventListener('click', this.onClick);
  };

  utils.inherit(Picture, BaseComponent);

  //обработчик клика по блоку с фотографией
  Picture.prototype.onClick = function(event) {
    event.preventDefault();
    gallery.show(this.data.getKeyPicture());
  };

  //удаление обработчиков событий
  Picture.prototype.remove = function() {
    this.element.removeEventListener('click', this.onClick);
    BaseComponent.prototype.remove.call(this);
  };

  return {
    getPictureElement: getPictureElement,
    Picture: Picture
  };
});
