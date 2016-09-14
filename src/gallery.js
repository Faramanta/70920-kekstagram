'use strict';

define(function() {
  var Gallery = function() {
    this.pictures = [];
    this.activePicture = 0;

    this.galleryOverlay = document.querySelector('.gallery-overlay');
    this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
    this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');
    this.likesCount = document.querySelector('.likes-count');
    this.commentsCount = document.querySelector('.comments-count');
  };

  Gallery.prototype.clearList = function() {
    this.pictures = [];
  };

  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = this.pictures.concat(pictures);
  };

  Gallery.prototype.show = function(keyPicture) {
    this.onCloseClick();
    this.onPictureClick();

    this.galleryOverlay.classList.remove('invisible');
    this.setActivePicture(keyPicture);
  };

  Gallery.prototype.hide = function() {
    this.galleryOverlay.classList.add('invisible');

    this.galleryOverlayClose.onclick = null;
    this.galleryOverlayImage.onclick = null;
  };

  Gallery.prototype.setActivePicture = function(keyPicture) {
    if (keyPicture >= this.pictures.length) {
      keyPicture = 0;
    }

    this.activePicture = keyPicture;
    this.galleryOverlayImage.src = this.pictures[keyPicture].url;
    this.likesCount.textContent = this.pictures[keyPicture].likes;
    this.commentsCount.textContent = this.pictures[keyPicture].comments;
  };

  //Обработчик клика по Закрыть
  Gallery.prototype.onCloseClick = function() {
    var self = this;

    this.galleryOverlayClose.onclick = function() {
      self.hide();
    };
  };

  //Обработчик, который показывает следующее фото по клику на текущее
  //или показывает первое фото
  Gallery.prototype.onPictureClick = function() {
    var self = this;
    var nextKeyPicture;

    this.galleryOverlayImage.onclick = function() {
      if (self.activePicture >= self.activePicture.length - 1) {
        nextKeyPicture = 0;
      } else {
        nextKeyPicture = self.activePicture + 1;
      }

      self.setActivePicture(nextKeyPicture);
    };
  };

  return new Gallery();

});
